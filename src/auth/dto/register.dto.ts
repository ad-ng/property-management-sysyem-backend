import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

enum REGROLE {
  client = 'client',
  owner = 'owner',
}

export class registerDTO {
  @ApiProperty({ example: 'johnd'})
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'test@123'})
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'johndoe@hotmail.com'})
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ enum: ['client', 'owner']})
  @IsEnum(REGROLE, { message: 'role can only be owner or client' })
  @IsNotEmpty()
  role: string;
}
