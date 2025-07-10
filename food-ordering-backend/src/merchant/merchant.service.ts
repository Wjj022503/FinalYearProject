import { Injectable } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { hash } from 'crypto';

@Injectable()
export class MerchantService {
  constructor(
    private prisma: PrismaService
  ) {}
  async create(createMerchantDto: CreateMerchantDto, imagePath: string) {
    try {
      const hash = await argon.hash(createMerchantDto.password);
      const merchant = await this.prisma.merchant.create({
        data: {
          merchantName: createMerchantDto.merchantName,
          email: createMerchantDto.email,
          hash: hash,
          ownerName: createMerchantDto.ownerName,
          phone: createMerchantDto.phone,
          image: imagePath, // store the image path
        },
      });
      return merchant;
    } catch (error) {
      console.log('Error creating merchant:', error);
      throw error;
    }
  }

  findAll() {
    try{
      const merchants = this.prisma.merchant.findMany({
        select: {
          id: true,
          merchantName: true,
          email: true,
          ownerName: true,
          phone: true,
          image: true,
          status: true,
        },
      });
      return merchants;
    }
    catch (error) {
      console.log('Error fetching merchants', error);
      throw error;
    }
  }

  findAllAvailable() {
    try{
      const merchants = this.prisma.merchant.findMany({
        where: {
          status: true,
        },
        select: {
          id: true,
          merchantName: true,
          email: true,
          ownerName: true,
          phone: true,
          image: true,
          status: true,
        },
      });
      return merchants;
    }
    catch (error) {
      console.log('Error fetching merchants', error);
      throw error;
    }
  }

  findOne(id: number) {
    try{
      const merchant = this.prisma.merchant.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          merchantName: true,
          email: true,
          ownerName: true,
          phone: true,
          image: true,
          status: true,
        },
      });
      return merchant;
    }
    catch (error) {
      console.log('Error fetching merchant', error);
      throw error;
    }
  }

  getMerchantByFoodId(foodId: number) {
    try {
      const merchant = this.prisma.merchant.findFirst({
        where: {
          foods: {
            some: {
              id: foodId,
            },
          },
        },
        select: {
          id: true,
          merchantName: true,
          email: true,
          ownerName: true,
          phone: true,
          image: true,
          status: true,
        },
      });
      return merchant;
    } catch (error) {
      console.log('Error fetching merchant by food ID', error);
      throw error;
    }
  }

  async update(id: number, updateMerchantDto: UpdateMerchantDto, imagePath: string | null) {
    try {
      const dataToUpdate: any = {
        merchantName: updateMerchantDto.merchantName,
        ownerName: updateMerchantDto.ownerName,
        phone: updateMerchantDto.phone,
      };

      if (imagePath) {
        dataToUpdate.image = imagePath; // Only update image if new image is uploaded
      }

      const merchant = await this.prisma.merchant.update({
        where: {
          id: id,
        },
        data: dataToUpdate,
      });

      return merchant;
    } catch (error) {
      console.log('Error updating merchant', error);
      throw error;
    }
  }

  async updateStatus(id: number, status: boolean) {
    try {
      const merchant = await this.prisma.merchant.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
        select: {
          id: true,
          merchantName: true,
          status: true,
        },
      });
      return merchant;
    } catch (error) {
      console.log('Error updating merchant status', error);
      throw error;
    }
  }

  async remove(id: number) {
    try{
      const merchant = await this.prisma.merchant.delete({
        where: {
          id: id,
        },
      });
      return merchant;
    }
    catch (error) {
      console.log('Error deleting merchant', error);
      throw error;
    }
  }

  async getMerchantHistory(merchantId: number) {
    try{
      const orders = await this.prisma.order.findMany({
        where: {
          merchantId,
          status: {
            in: ['Completed','Cancelled'],
          },
        },
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return orders;
    }
    catch (error) {
      console.log('Error fetching merchant history', error);
      throw error;
    }
  }
}
