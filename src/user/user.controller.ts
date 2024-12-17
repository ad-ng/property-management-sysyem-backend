import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLE } from '@prisma/client';
import { request } from 'express';
import { IsVerifiedCheck } from 'src/auth/decorators/isverified.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { IsVerifiedGuard } from 'src/auth/gaurds/roles.guard.ts/isverified.guard';
import { RolesGuard } from 'src/auth/gaurds/roles.guard.ts/roles.guard.ts.guard';

@Controller('user')
export class UserController {
  // @Roles(ROLE.client)
  // @UseGuards(RolesGuard)

  @IsVerifiedCheck(true)
  @UseGuards(IsVerifiedGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  testing() {
    return 'testing user';
  }
}
