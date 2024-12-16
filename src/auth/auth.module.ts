import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtStrategy } from './strategy';
import { VerificationModule } from 'src/verification/verification.module';

@Module({
  providers: [AuthService, jwtStrategy],
  controllers: [AuthController],
  imports: [JwtModule.register({}), VerificationModule],
})
export class AuthModule {}
