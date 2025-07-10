import { Merchant } from "@prisma/client";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFoodDto {
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
