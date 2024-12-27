import { apartmentStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class addApartmentDTO {
  @IsNumber()
  @IsNotEmpty()
  propertyId: Number;

  @IsNotEmpty()
  @IsString()
  apartmentName: string;

  @IsOptional()
  @IsNumber()
  floor_number: Number;

  @IsEnum(apartmentStatus, {
    message: 'status can only be   vacant, occupied, maintenance',
  })
  status: apartmentStatus;
}
