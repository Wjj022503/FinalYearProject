import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MerchantJwtStrategy extends PassportStrategy(Strategy, 'merchant_jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('MERCHANT_JWT_SECRET') || '',
    });
  }

  async validate(payload: any) {
    return payload;
  }
}