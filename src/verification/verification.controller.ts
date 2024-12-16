import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('verification')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  verSender(@Req() req: Request) {
    return this.verificationService.sendVer(req.user);
  }
}
