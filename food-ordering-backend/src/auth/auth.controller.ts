import { Controller, Get, Post, Body, Req, UseGuards, Res, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, changePasswordDto } from './dto';
import { MerchantJwtGuard } from '../auth/merchant_guard';
import { JwtGuard } from '../auth/guard';
import { AdminJwtGuard } from './admin_guard';
import { Response, Request} from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    console.log({
      dto,
    });
    return this.authService.signUp(dto);
  }

  @Post('login')
  async login(@Body() dto: SignInDto, @Res({ passthrough: true }) response: Response) {
    const { access_token, refresh_token } = await this.authService.signIn(dto);

    response.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: true, // only true on HTTPS (important for production)
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { access_token };
  }

  @Post('merchant/login')
  async merchantSignin(@Body() dto: SignInDto, @Res({ passthrough: true }) response: Response) {
    const { merchant_access_token, merchant_refresh_token } = await this.authService.merchantSignIn(dto);

    response.cookie('merchant_refresh_token', merchant_refresh_token, {
        httpOnly: true,
        secure: true, // only true on HTTPS (important for production)
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { merchant_access_token };
  }

  @Post('admin/login')
  async adminSignin(@Body() dto: SignInDto, @Res({ passthrough: true }) response: Response) {
    
    const { admin_access_token, refresh_token } = await this.authService.adminSignIn(dto);

    response.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: true, // only true on HTTPS (important for production)
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { admin_access_token };
  }

  @UseGuards(JwtGuard)
  @Get('customer/me')
  getCustomerByToken(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
  
    if (typeof authHeader !== 'string') {
      throw new ForbiddenException('Invalid authorization header');
    }
  
    const token = authHeader.replace('Bearer ', '');
    return this.authService.getCustomerByToken(token);
  }
  
  @UseGuards(MerchantJwtGuard)
  @Get('merchant/me')
  getMerchantByToken(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
  
    if (typeof authHeader !== 'string') {
      throw new ForbiddenException('Invalid authorization header');
    }
  
    const token = authHeader.replace('Bearer ', '');
    return this.authService.getMerchantByToken(token);
  }

  @UseGuards(AdminJwtGuard)
  @Get('admin/me')
  getAdminByToken(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
  
    if (typeof authHeader !== 'string') {
      throw new ForbiddenException('Invalid authorization header');
    }
  
    const token = authHeader.replace('Bearer ', '');
    return this.authService.getAdminByToken(token);
  }

  @Get('refresh/merchant')
  async refreshMerchant(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
      const refreshToken = request.cookies['merchant_refresh_token'];
  
      if (!refreshToken) {
          throw new ForbiddenException('Refresh token not found');
      }
      const newAccessToken = await this.authService.refreshMerchantAccessToken(refreshToken);
  
      return { merchant_access_token: newAccessToken };
  }

  @UseGuards(JwtGuard)
  @Post('change-password')
  changePassword(@Body() dto: changePasswordDto) {
    return this.authService.changePassword(dto.userId, dto.newPassword);
  }

  @Post('admin/signup')
  async adminSignup(@Body() dto: SignUpDto) {
    return this.authService.adminSignUp(dto);
  }
}
