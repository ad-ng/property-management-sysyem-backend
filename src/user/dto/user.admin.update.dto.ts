import { ApiProperty } from '@nestjs/swagger';
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
  admin = 'admin',
}

export class UserAdminUpdateDTO {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  fullname: string;

  @ApiProperty({ example: 'john' })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ example: 'male' })
  @IsEnum(GENDER, { message: 'gender can only be male or female' })
  @IsOptional()
  gender: string;

  @ApiProperty({ example: '2005-01-11' })
  @IsDate()
  @IsOptional()
  dob: Date;

  @ApiProperty({ example: '(338) 824-5877 x386' })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty()
  @IsMimeType()
  @IsOptional()
  profileImg: File;

  @ApiProperty({ enum: ['admin', 'owner', 'client'] })
  @IsEnum(REGROLE, { message: 'role can only be owner, client, admin' })
  @IsNotEmpty()
  role: string;
}
