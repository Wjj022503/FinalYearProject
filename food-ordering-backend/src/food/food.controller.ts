import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { MerchantJwtGuard } from 'src/auth/merchant_guard'; 

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @UseGuards(MerchantJwtGuard)
  @Post('add')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: `./public/images/foods`,
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async createFood(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFoodDto: CreateFoodDto,
  ) {
    const imagePath = file
    ? `/images/foods/${file.filename}`
    : createFoodDto.type == "Food" ? `/images/foods/default-food.jpg` : `/images/foods/default-drink.jpg`;
    return this.foodService.create(createFoodDto, imagePath);
  }

  @UseGuards(MerchantJwtGuard)
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: `./public/images/foods`,
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async updateFood(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createFoodDto: CreateFoodDto,
  ) {
    const food = await this.foodService.findOne(+id);
    const oldImagePath = food?.image || "";
    //if file is undefined, use the old image path
    const imagePath = (file && file.filename)
    ? `/images/foods/${file.filename}` 
    : oldImagePath;

    return this.foodService.update(+id, createFoodDto, imagePath);
  }

  @Post('all')
  findAll(@Body('merchantID') merchantID: number) {
    return this.foodService.findAll(merchantID);
  }
  
  @Get('available/:id')
  findAvailableFoods(@Param('id') id: string) {
    return this.foodService.findAvailableFoods(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.foodService.remove(+id);
  }
}
