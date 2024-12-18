import { GENDER } from '@prisma/client';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsMimeType,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserClientDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  fullname: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsEnum(GENDER, { message: 'gender can only be male or female' })
  @IsOptional()
  gender: string;

  @IsDate()
  @IsOptional()
  dob: Date;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsMimeType()
  @IsOptional()
  profileImg: File;
}
