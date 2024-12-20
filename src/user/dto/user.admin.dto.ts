import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

enum REGROLE {
  client = 'client',
  owner = 'owner',
  admin = 'admin',
}

export class adminUserDTO {
  @ApiProperty({ example: `Joy.Schinner` })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'test@123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'Darby20@hotmail.com ' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ enum: ['admin', 'owner', 'client'] })
  @IsEnum(REGROLE, { message: 'role can only be owner, client, admin' })
  @IsNotEmpty()
  role: string;
}
