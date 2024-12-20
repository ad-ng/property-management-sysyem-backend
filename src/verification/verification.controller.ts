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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { OtpDTO } from './otp.dto';

@Controller('verify')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @ApiOperation({ summary: 'sending verification' })
  @ApiOkResponse({
    description: 'when email is sent',
    example: {
      message: 'email sent',
    },
  })
  @ApiBadRequestResponse({
    description: 'for wrong email',
    example: {
      message: 'incorrect email',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  verSender(@Req() req: Request) {
    return this.verificationService.sendVer(req.user);
  }

  @ApiOperation({
    summary: 'actual verification',
    description: 'verifying OTP',
  })
  @ApiNotFoundResponse({
    description: 'Possible error messages: email not found, no otp found',
    schema: {
      example: {
        message: 'email not found !',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'wrong OTP',
    schema: {
      example: {
        message: 'incorrect OTP',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiOkResponse({
    description: 'for correct OTP',
    schema: {
      example: {
        message: 'verified successfully',
      },
    },
  })
  @Get(':email')
  verifyMe(@Query() OTP: OtpDTO, @Param('email') email: string) {
    return this.verificationService.verifyOTP(OTP, email);
  }
}
