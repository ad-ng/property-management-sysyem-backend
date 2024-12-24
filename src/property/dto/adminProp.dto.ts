import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AdminPropertyDTO {
  @IsNotEmpty()
  @IsString()
  title: String;

  @IsString()
  @IsOptional()
  description: String;

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

  @IsNumber()
  @IsNotEmpty()
  ownerId: Number;
}
