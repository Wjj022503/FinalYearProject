import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MerchantService } from './merchant.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { AdminJwtGuard } from 'src/auth/admin_guard';
import { MerchantJwtGuard } from 'src/auth/merchant_guard';

@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @UseGuards(AdminJwtGuard)
  @Post('add')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images/merchants',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB limit
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMerchantDto: CreateMerchantDto,
  ) {
    const imagePath = file 
      ? `/images/merchants/${file.filename}` 
      : `/images/merchants/default-merchant.jpg`; // fallback if no image uploaded

    console.log('Creating merchant with data:\n', createMerchantDto, '\nImage Path:', imagePath);
    return this.merchantService.create(createMerchantDto, imagePath);
  }
 
  @Get('all')
  findAll() {
    return this.merchantService.findAll();
  }

  @Get('available')
  findAllAvailable() {
    return this.merchantService.findAllAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.merchantService.findOne(+id);
  }

  @UseGuards(AdminJwtGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './public/images/merchants',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB limit
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMerchantDto: UpdateMerchantDto,
  ) {
    const imagePath = file ? `/images/merchants/${file.filename}` : null;
    return this.merchantService.update(+id, updateMerchantDto, imagePath);
  }

  @UseGuards(MerchantJwtGuard)
  @Patch('update-status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: boolean,
  ) {
    return this.merchantService.updateStatus(+id, status);
  }

  @UseGuards(AdminJwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.merchantService.remove(+id);
  }

  @Get('food/:id')
  getMerchantByFoodId(@Param('id') id: string) {
    return this.merchantService.getMerchantByFoodId(+id);
  }

  @Get('history/:merchantId')
  @UseGuards(MerchantJwtGuard)
  async getOrderHistory(@Param('merchantId') merchantId: number) {
    return this.merchantService.getMerchantHistory(Number(merchantId));
  }
}
