import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class AddItemDto {
  @IsInt()
  @IsNotEmpty()
  foodId: number;

  @IsString()
  @IsNotEmpty()
  foodName: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  
  @IsNotEmpty()
  priceAtTime: number;

  @IsString()
  image: string;
}
