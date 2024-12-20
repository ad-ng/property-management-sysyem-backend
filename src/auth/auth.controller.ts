import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDTO, registerDTO } from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @ApiOperation({ summary: 'login a user' })
  @ApiForbiddenResponse({
    description: 'mismatching credentials',
    example: {
      message: 'invalid credentials',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @ApiCreatedResponse({
    description: 'correct credentials',
    example: {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoiYWRvbHBoZW5nb2dhQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRuMjUwIiwiaXNWZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzM0Njc5NDcxfQ.j60DKQ7m2oxI1qvEorZyRQo0i0x_GZ7qi-wSSzyzc6k',
    },
  })
  @Post('signin')
  sign(@Body() dto: LogInDTO) {
    return this.auth.login(dto);
  }

  @ApiOperation({ summary: 'register a user' })
  @ApiBadRequestResponse({
    description: 'for already existing email',
    example: {
      message: 'email already taken',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiCreatedResponse({
    description: 'correct credentials',
    example: {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoiYWRvbHBoZW5nb2dhQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRuMjUwIiwiaXNWZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzM0Njc5NDcxfQ.j60DKQ7m2oxI1qvEorZyRQo0i0x_GZ7qi-wSSzyzc6k',
    },
  })
  @Post('signup')
  signup(@Body() dto: registerDTO) {
    return this.auth.register(dto);
  }
}
