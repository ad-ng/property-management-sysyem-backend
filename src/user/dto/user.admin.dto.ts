import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

enum REGROLE {
  client = 'client',
  owner = 'owner',
  admin = 'admin'
}

export class adminUserDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsEnum(REGROLE, { message: 'role can only be owner or client' })
  @IsNotEmpty()
  role: string;
}
