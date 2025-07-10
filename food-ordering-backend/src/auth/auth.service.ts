import {
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: SignUpDto){
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          UserName: dto.UserName,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log('***************Email already exists*******************\n', error);
          throw new ForbiddenException('Credentials taken');
        }
      }
      console.log('Error creating user', error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  async signIn(dto: SignInDto):Promise<{ access_token: string, refresh_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email);
  }

  @HttpCode(HttpStatus.OK)
  async merchantSignIn(dto: SignInDto):Promise<{ merchant_access_token: string, merchant_refresh_token: string }> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { email: dto.email },
    });

    if (!merchant) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(merchant.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signMerchantToken(merchant.id, merchant.email);
  }
  
  @HttpCode(HttpStatus.OK)
  async adminSignIn(dto: SignInDto):Promise<{ admin_access_token: string, refresh_token: string }> {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (!admin) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(admin.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signAdminToken(admin.id, admin.email);
  }

  async signToken(
    userID: number,
    email: string,
  ): Promise<{ access_token: string, refresh_token: string }> {
    const payload = { sub: userID, email, role: 'customer' };

    const access_token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '1h',
    });
  
    const refresh_token = await this.jwt.signAsync(payload, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });
  
    return {
      access_token,
      refresh_token,
    };
  }

  async signMerchantToken(
    userID: number,
    email: string,
  ): Promise<{ merchant_access_token: string, merchant_refresh_token: string }> {
    const payload = { sub: userID, email, role:"merchant" };
    const secret = this.config.get('MERCHANT_JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });

    const refresh_secret = this.config.get('REFRESH_TOKEN_SECRET');
    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: refresh_secret,
    });

    return { merchant_access_token: token, merchant_refresh_token: refresh_token };
  }

  async signAdminToken(
    userID: number,
    email: string,
  ): Promise<{ admin_access_token: string, refresh_token: string }> {
    const payload = { sub: userID, email, role:"admin" };
    const secret = this.config.get('ADMIN_JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });

    const refresh_secret = this.config.get('REFRESH_TOKEN_SECRET');
    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: refresh_secret,
    });

    return { admin_access_token: token, refresh_token };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      });
  
      if (!payload || typeof payload !== 'object' || !payload.sub) {
        throw new ForbiddenException('Invalid refresh token');
      }
      const newAccessToken = await this.jwt.signAsync(payload, {
        expiresIn: '1h',
        secret: this.config.get('JWT_SECRET'),
      });
      return newAccessToken;
    }
    catch (error) {
      throw new ForbiddenException('Refresh token expired or invalid');
    }
  }

  async refreshMerchantAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      });
  
      if (!payload || typeof payload !== 'object' || !payload.sub) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const new_payload = { sub:payload.sub, email:payload.email};

      const newAccessToken = await this.jwt.signAsync(new_payload, {
          expiresIn: '1h',
          secret: this.config.get('MERCHANT_JWT_SECRET'),
        });
      return newAccessToken;
    } catch (error) {
      throw new ForbiddenException('Refresh token expired or invalid');
    }
  }
  
  async refreshAdminAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      });
  
      if (!payload || typeof payload !== 'object' || !payload.sub) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const new_payload = { sub:payload.sub, email:payload.email};

      const newAccessToken = await this.jwt.signAsync(new_payload, {
          expiresIn: '1h',
          secret: this.config.get('ADMIN_JWT_SECRET'),
        });
      return newAccessToken;
    }
    catch (error) {
      throw new ForbiddenException('Refresh token expired or invalid');
    }
  }

  async getCustomerByToken(token: string) {
    try {
      const decoded = await this.jwt.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      if (typeof decoded === 'object' && 'email' in decoded) {
        const { email } = decoded;
        const customer = await this.prisma.user.findUnique({
          where: { email },
        });
        if (!customer) {
          throw new UnauthorizedException('Invalid token');
        }
        return customer;
      }
    }
    catch (error) {
      console.log('Error decoding JWT:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getMerchantByToken(token: string) {
    try {
      const decoded = await this.jwt.verifyAsync(token, {
        secret: this.config.get('MERCHANT_JWT_SECRET'),
      });
      if (typeof decoded === 'object' && 'email' in decoded) {
        const { email } = decoded;
        const merchant = await this.prisma.merchant.findUnique({
          where: { email },
        });
        if (!merchant) {
          throw new UnauthorizedException('Invalid token');
        }
        return merchant;
      }
    }
    catch (error) {
      console.log('Error decoding JWT:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getAdminByToken(token: string) {
    try {
      const decoded = await this.jwt.verifyAsync(token, {
        secret: this.config.get('ADMIN_JWT_SECRET'),
      });
      if (typeof decoded === 'object' && 'email' in decoded) {
        const { email } = decoded;
        const admin = await this.prisma.admin.findUnique({
          where: { email },
        });
        if (!admin) {
          throw new UnauthorizedException('Invalid token');
        }
        return admin;
      }
    }
    catch (error) {
      console.log('Error decoding JWT:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async changePassword(userId: number, newPassword: string) {
    const hash = await argon.hash(newPassword);
    try {
      const user =await this.prisma.user.update({
        where: { id: userId },
        data: { hash },
      });
      return user;
    } catch (error) {
      console.log('Error updating password', error);
      throw error;
    }
  }

  //admin register
  async adminSignUp(dto: SignUpDto) {
    const hash = await argon.hash(dto.password);
    try {
      const admin = await this.prisma.admin.create({
        data: {
          email: dto.email,
          hash,
          adminName: dto.UserName,
        },
      });

      return this.signAdminToken(admin.id, admin.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log('***************Email already exists*******************\n', error);
          throw new ForbiddenException('Credentials taken');
        }
      }
      console.log('Error creating user', error);
      throw error;
    }
  }
} 
