import {
  WebSocketGateway, WebSocketServer,
  OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage, MessageBody, ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { OrderService } from './order.service';
import { ConfigService } from '@nestjs/config';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@WebSocketGateway({
  namespace: '/orders',
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private jwt: JwtService, private orderSvc: OrderService, private config: ConfigService) {}

  async handleConnection(client: Socket) {
    const { token } = client.handshake.auth ?? {};
  
    if (!token) {
      console.warn('[Socket] No token provided.');
      client.disconnect();
      return;
    }
  
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });
  
      if (payload.role === 'customer') {
        client.join(`customer:${payload.sub}`);
        console.log('[Socket] Connected: customer', payload.sub);
        return;
      }
    } catch (err) {
      console.log('[Socket] Not a customer token, trying merchant...');
    }
  
    try {
      const merchantPayload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('MERCHANT_JWT_SECRET'),
      });
  
      if (merchantPayload.role === 'merchant') {
        client.join(`merchant:${merchantPayload.sub}`);
        console.log('[Socket] Connected: merchant', merchantPayload.sub);
        return;
      }
    } catch (err) {
      console.error('[Socket] Token verification failed:', err.message);
      client.disconnect();
    }
  }  
  
  handleDisconnect(clientId: string) {
    /// No action needed here
    console.log('Client disconnected', clientId);
  }

  //EVENT
  // CUSTOMER sends placeOrder
  @SubscribeMessage('placeOrder')
  async placeOrder(
    @MessageBody() dto: CreateOrderDto,
    @ConnectedSocket() client: Socket,
  ) {
    const orders = await this.orderSvc.create(dto); // Now orders is an array!
  
    // 1) Notify each merchant dashboard
    for (const order of orders) {
      console.log(`New order created for merchant ${order.merchantId}: Order ID ${order.id}`);
      this.server.to(`merchant:${order.merchantId}`).emit('newOrder', order);
    }
    
    // 2) Acknowledge customer (you can send back all orders at once)
    client.emit('orderAccepted', orders);
  }  

  // MERCHANT updates status
  @SubscribeMessage('updateOrderStatus')
  async updateStatus(
    @MessageBody() payload: { orderId: number; data: UpdateOrderStatusDto },
  ) {
    const order = await this.orderSvc.changeStatus(payload.orderId, payload.data);
    // Notify the customer only
    if (payload.data.status === 'Wait for Pickup'){
      this.server.to(`customer:${order.userId}`).emit('orderReady', order);
    }
    else if (payload.data.status === 'Cancelled') {
      this.server.to(`customer:${order.userId}`).emit('orderCancelled', order);
    }
    else{
      this.server.to(`customer:${order.userId}`).emit('orderStatusUpdated', order);
    }
    // Optionally echo to merchant room too
    this.server.to(`merchant:${order.merchantId}`).emit('orderStatusUpdated', order);
  }
}