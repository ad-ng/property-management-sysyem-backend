import { IsEmail, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
