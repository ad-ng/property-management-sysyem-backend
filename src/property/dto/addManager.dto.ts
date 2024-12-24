import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddManagerDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  managerEmail: string;

  @IsNumber()
  @IsNotEmpty()
  id: Number;
}
