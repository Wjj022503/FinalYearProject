// update-order.dto.ts
import { IsOptional, IsString, IsInt, IsPositive } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional() @IsString() paymentMethod?: string;
  @IsOptional() status?: never;               // status change uses its own DTO
}

export class UpdateOrderStatusDto {

  @IsString() status:
    'Pending' | 'Preparing' | 'Wait for Pickup' | 'Completed' | 'Cancelled';
}