import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtStrategy } from './strategy';

@Module({
  providers: [AuthService,jwtStrategy],
  controllers: [AuthController],
  imports: [JwtModule.register({})],
})
export class AuthModule {}
