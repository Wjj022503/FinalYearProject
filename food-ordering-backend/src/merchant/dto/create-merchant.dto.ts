import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateMerchantDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    merchantName: string;
    
    @IsString()
    @IsNotEmpty()
    ownerName: string;
    
    @IsString()
    phone: string;
}
