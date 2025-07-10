import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddItemDto } from './dto/add-item-cart.dto';

@Injectable()
export class CartService {

  constructor(private prisma: PrismaService) {}

  async findOrCreateCart(userId: number) {
    try{
      let cart = await this.prisma.cart.findFirst({
        where: {
          userId,
          status: 'active',
        },
      });
    
      if (!cart) {
        cart = await this.prisma.cart.create({
          data: {
            userId,
            status: 'active',
          },
        });
      }
      return cart;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }  

  async findOrCreateGuestCart(guestId: string) {
    try{
      const cart = await this.prisma.cart.findFirst({
        where: {
          guestId: guestId,
          status: 'active',
        },
      });
      if (!cart) {
        return await this.prisma.cart.create({
          data: {
            guestId,
            status: 'active',
          },
        });      
      }
      return cart;
    } catch (error) {
      console.error(error);
      throw error;
    }    
  }

  async getCurrentCart(userId?: number, guestID?: string) {
    try {
      if (userId) {
        const cart = await this.findOrCreateCart(userId);
        return cart;
      } else if (guestID) {
        const cart = await this.findOrCreateGuestCart(guestID);
        return cart;
      }
      throw new Error('No user or guest specified');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async addItemToCart(addItemDto: AddItemDto, userId: number) {
    const { foodId, foodName, quantity, priceAtTime, image } = addItemDto;
    const cart = await this.findOrCreateCart(userId);
    // Check if the item already exists in the cart
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        foodId: foodId,
      },
    });
  
    if (existingCartItem) {
      // If exists, update the quantity
      const updatedCartItem = await this.prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
  
      return updatedCartItem;
    } else {
      // If not exists, create new
      const cartItem = await this.prisma.cartItem.create({
        data: {
          cartId:cart.id,
          foodId,
          foodName,
          quantity,
          priceAtTime,
          image,
        },
      });
  
      return cartItem;
    }
  }
  

  async updateCartItem(cartItemId: number, quantity: number) {
    const cartItem = await this.prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
    });
  
    return cartItem;
  }

  async deleteCartItem(cartItemId: number) {
    const cartItem = await this.prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
  
    return cartItem;
  }

  async getAllCartItems(userId: number) {
    const cart = await this.findOrCreateCart(userId);
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
      },
    });
  
    return cartItems;
  }

  async removeAllCartItems(cartId: number) {
    try{
      return await this.prisma.cartItem.deleteMany({
        where: {
          cartId,
        },
      });
    }
    catch (error) {
      console.error(error);
      throw error;
    }
  }
}
