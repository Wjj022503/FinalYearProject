import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDto } from './create-food.dto';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Merchant } from '@prisma/client';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
        @IsString()
        @IsNotEmpty()
        name: string;
      
        @Type(() => Number)
        @IsNumber()
        @IsNotEmpty()
        price: number;
      
        @IsString()
        @IsNotEmpty()
        type: string;
      
        @Type(() => Number) // <-- Add this
        @IsNumber()
        @IsNotEmpty()
        merchantID: Merchant["id"];
}
