import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AdminPropertyUpdateDTO {
  @IsNotEmpty()
  @IsString()
  title: String;

  @IsOptional()
  @IsString()
  newTitle: String;

  @IsString()
  @IsOptional()
  description: String;

  @IsOptional()
  @IsString()
  @IsEmail()
  managerEmail: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  country: String;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  province: String;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  district: String;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  sector: String;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  cell: String;

  @IsNumber()
  @IsOptional()
  totalUnits: Number;

  @IsString()
  @IsEmail()
  @IsOptional()
  owner: string
}
