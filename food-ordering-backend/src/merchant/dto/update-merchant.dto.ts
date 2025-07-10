import { PartialType } from '@nestjs/mapped-types';
import { CreateMerchantDto } from './create-merchant.dto';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateMerchantDto extends PartialType(CreateMerchantDto) {
    @IsNotEmpty()
    @IsString()
    merchantName: string;
    
    @IsNotEmpty()
    @IsString()
    ownerName: string;
    
    @IsNotEmpty()
    @IsString()
    phone: string;
}
