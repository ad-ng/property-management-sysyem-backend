import { ApiProperty } from '@nestjs/swagger';
import { GENDER } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsMimeType,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserClientDto {
  @ApiProperty({ example: 'johndoe@hotmail.com' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'john doe' })
  @IsString()
  @IsOptional()
  fullname: string;

  @ApiProperty({ example: 'john' })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ enum: ['male', 'female'] })
  @IsEnum(GENDER, { message: 'gender can only be male or female' })
  @IsOptional()
  gender: string;

  @ApiProperty({ example: '2024-12-21' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dob: Date;

  @ApiProperty({ example: '08999866654' })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty()
  @IsMimeType()
  @IsOptional()
  profileImg: File;
}
