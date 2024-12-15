import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDTO, registerDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signin')
  sign(@Body() dto: LogInDTO) {
    return this.auth.login(dto);
  }

  @Post('signup')
  signup(@Body() dto: registerDTO) {
    return this.auth.register(dto);
  }
}
