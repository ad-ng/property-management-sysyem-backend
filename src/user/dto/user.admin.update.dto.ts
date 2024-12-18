import { GENDER } from '@prisma/client';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsMimeType,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

enum REGROLE {
  client = 'client',
  owner = 'owner',
  admin = 'admin'
}

export class UserAdminUpdateDTO {
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

@IsEnum(REGROLE, { message: 'role can only be owner, client, admin' })
  @IsNotEmpty()
  role: string;
}
