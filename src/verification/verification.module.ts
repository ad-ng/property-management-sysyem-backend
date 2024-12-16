import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';

@Module({
  providers: [VerificationService],
  controllers: [VerificationController]
})
export class VerificationModule {}
