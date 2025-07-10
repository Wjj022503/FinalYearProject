import { PartialType } from '@nestjs/mapped-types';
import { AddItemDto } from './add-item-cart.dto';
import { IsNotEmpty, IsNumber } from 'class-validator'; 

export class UpdateCartDto extends PartialType(AddItemDto) {
    
    @IsNotEmpty()
    @IsNumber()
    cartId: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}
