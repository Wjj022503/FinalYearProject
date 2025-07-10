import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { MerchantJwtStrategy } from './merchant_strategy';
import { AdminJwtStrategy } from './admin_strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MerchantJwtStrategy, AdminJwtStrategy],
})
export class AuthModule {}
