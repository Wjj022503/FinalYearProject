import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const foodIds = dto.items.map(i => i.foodId);
    
    // 1. Fetch all foods
    const foods = await this.prisma.food.findMany({
      where: { id: { in: foodIds } },
      select: { id: true, merchantID: true, price: true },
    });
  
    if (foods.length !== foodIds.length) {
      throw new BadRequestException('One or more food items not found');
    }
  
    const foodMap = new Map(foods.map(f => [f.id, f]));
  
    // 2. Group items by merchant
    const ordersByMerchant: Record<number, { foodId: number; quantity: number; price: number }[]> = {};
  
    for (const item of dto.items) {
      const food = foodMap.get(item.foodId);
      if (!food) continue;
  
      const merchantID = food.merchantID;
  
      if (!ordersByMerchant[merchantID]) {
        ordersByMerchant[merchantID] = [];
      }
      ordersByMerchant[merchantID].push({
        foodId: item.foodId,
        quantity: item.quantity,
        price: food.price,
      });
    }
  
    // 3. Create orders per merchant
    const createdOrders: Order[] = [];
  
    for (const [merchantId, items] of Object.entries(ordersByMerchant)) {
      const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  
      const createdOrder = await this.prisma.order.create({
        data: {
          userId: dto.userId,
          merchantId: Number(merchantId), // ⚡ careful: Object.entries gives string keys
          paymentMethod: dto.paymentMethod,
          totalPrice: totalPrice,
          orderItems: {
            create: items.map(i => ({
              foodId: i.foodId,
              quantity: i.quantity,
            })),
          },
        },
        include: {
          user: {
            select: { id: true, UserName: true },
          },
          merchant: {
            select: { id: true, merchantName: true },
          },
          orderItems: {
            include: {
              food: {
                select: { id: true, name: true },
              }
            }
          }
        },
      });
  
      createdOrders.push(createdOrder);
    }
  
    return createdOrders; // Return array of orders
  }  

  async update(id: number, dto: UpdateOrderDto) {
    return this.prisma.order.update({ where: { id }, data: dto });
  }

  async changeStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: {
        user: {
          select: { id: true, UserName: true }, // Adjust field names based on your actual model
        },
        orderItems: {
          include: {
            food: {
              select: { id: true, name: true },
            }
          }
        }
      },
    });
    return order;
  }
  

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException();
    return order;
  }

  async getOrdersForMerchant(merchantId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        merchantId: merchantId,
      },
      include: {
        user: {
          select: {
            id: true,
            UserName: true,
          },
        },
        orderItems: {
          include: {
            food: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return orders;
  }

  async getOrdersForCustomer(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc', // Newest first
      },
      take: 30, // take first 30, or use pagination later
      include: {
        orderItems: {
          include: {
            food: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  
    // Map the result into the desired dummyOrders format
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      totalPrice: order.totalPrice,
      orderItems: order.orderItems.map((item) => ({
        foodName: item.food.name,
        quantity: item.quantity,
      })),
    }));
  
    return formattedOrders;    
  }
}