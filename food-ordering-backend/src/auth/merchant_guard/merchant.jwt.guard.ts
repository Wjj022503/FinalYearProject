import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MerchantJwtGuard extends AuthGuard('merchant_jwt') {
  constructor() {
    super();
  }
}