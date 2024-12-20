import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ example: 'johndoe@hotmail.com'})
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
