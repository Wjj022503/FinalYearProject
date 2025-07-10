import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('merchant/:merchantId')
  async getOrdersForMerchant(@Param('merchantId') merchantId: number) {
    return this.orderService.getOrdersForMerchant(+merchantId);
  }

  @Get('customer/:userId')
  async getOrdersForCustomer(@Param('userId') userId: number) {
    return this.orderService.getOrdersForCustomer(+userId);
  }
}