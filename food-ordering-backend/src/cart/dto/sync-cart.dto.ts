import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsString, ValidateNested } from 'class-validator';

export class SyncCartDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];
  }
  
  export class CartItemDto {
    @IsInt()
    foodId: number;

    @IsString()
    foodName: string;
  
    @IsInt()
    quantity: number;
  
    @IsNumber()
    priceAtTime: number;
  }
  