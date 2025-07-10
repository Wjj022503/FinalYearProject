// create-order.dto.ts
import { IsInt, IsPositive, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsInt() @IsPositive() foodId: number;
  @IsInt() @IsPositive() quantity: number;
}

export class CreateOrderDto {
  @IsInt() userId: number;

  @IsString() paymentMethod: string;          // e.g. 'cash', 'card'
  @IsArray() @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}