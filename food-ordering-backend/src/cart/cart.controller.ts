import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddItemDto } from './dto/add-item-cart.dto';
import { SyncCartDto } from './dto/sync-cart.dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  
  @Get('current')
  getCart(
    @Headers('userID') userID: number,
    @Headers('guestID') guestId: string) {
    return this.cartService.getCurrentCart(userID, guestId);
  }

  @UseGuards(JwtGuard)
  @Get('all/:id') //customer ID
  getCartItems(@Param('id') id: string) {
    return this.cartService.getAllCartItems(+id);
  }
  
  @UseGuards(JwtGuard)
  @Post('add/:id') //customer ID
  addItem(@Param('id') id: string, @Body() addItemDto: AddItemDto) {
    return this.cartService.addItemToCart(addItemDto,+id);
  }

  @Patch('update/:cartItemId')
  updateItem(@Param('cartItemId') cartItemId: string, @Body() update: UpdateCartDto) {
    //parseInt(cartItemId);
    return this.cartService.updateCartItem(Number(cartItemId), update.quantity);
  }

  @Delete('delete/:cartItemId')
  deleteItem(@Param('cartItemId') cartItemId: string) {
    return this.cartService.deleteCartItem(Number(cartItemId));
  }  

  @Delete('all/:id') //cart ID
  remove(@Param('id') id: string) {
    return this.cartService.removeAllCartItems(+id);
  }
}
