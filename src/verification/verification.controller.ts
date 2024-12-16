import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('verify')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  verSender(@Req() req: Request) {
    return this.verificationService.sendVer(req.user);
  }

  @Get(':email')
  verifyMe(@Query() OTP: string, @Param('email') email: string) {
    return this.verificationService.verifyOTP(OTP, email);
  }
}
