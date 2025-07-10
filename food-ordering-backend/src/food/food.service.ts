import { Injectable, UseGuards } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { MerchantJwtGuard } from 'src/auth/merchant_guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { unlink } from 'fs/promises';
import { join } from 'path';

@UseGuards(MerchantJwtGuard)
@Injectable()
export class FoodService {
  constructor(private prisma: PrismaService) {
  }

  async create(createFoodDto: CreateFoodDto, imagePath: string) {
    try {
      const new_food = await this.prisma.food.create({
        data: {
          name: createFoodDto.name,
          price: createFoodDto.price,
          status: true,
          type: createFoodDto.type,
          merchantID: createFoodDto.merchantID,
          image:imagePath,
        },
      });
      return new_food;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id: number, updateFoodDto: UpdateFoodDto, imagePath: string) {
    try {
      const food = await this.prisma.food.findUnique({
        where: {
          id: id,
        },
      })
      
      if(food?.image){
        await this.removeImage(food.image);
      }

      const updated_food = await this.prisma.food.update({
        where: {
          id: id,
        },
        data: {
          name: updateFoodDto.name,
          price: updateFoodDto.price,
          status: true,
          type: updateFoodDto.type,
          merchantID: updateFoodDto.merchantID,
          image:imagePath,
        },
      });
      return updated_food;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const deleted_food = await this.prisma.food.delete({
        where: {
          id: id,
        },
      });
      return deleted_food;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeImage(imagePath: string) {
    try{
      if(imagePath === "/images/foods/default-food.jpg" || imagePath === "/images/foods/default-drink.jpg") return;
      await unlink(join(process.cwd(), "/public",imagePath));  
    }
    catch (error) {
      console.error(error);
      throw error;
    }
  }

  findAll(merchantID: number) {
    // fectch all foods that status is true from db
    return this.prisma.food.findMany({
      where: {
        merchantID: merchantID,
      }
    });
  }

  findAvailableFoods(merchantID: number) {
    return this.prisma.food.findMany({
      where: {
        merchantID: merchantID,
        status: true,
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.food.findUnique({
      where: {
        id: id,
      },
    });
  }
}
