import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrderService } from './order.service';
import { OrderGateway } from './order.gateway';
import { OrderController } from './order.controller';

@Module({
  imports: [JwtModule.register({}),],
  controllers: [OrderController],
  providers: [OrderGateway, OrderService],
  exports:   [OrderService],
})
export class OrderModule {}
