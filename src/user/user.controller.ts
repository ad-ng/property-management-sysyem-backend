import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLE } from '@prisma/client';
import { Request, request } from 'express';
import { IsVerifiedCheck } from 'src/auth/decorators/isverified.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { IsVerifiedGuard } from 'src/auth/gaurds/roles.guard.ts/isverified.guard';
import { RolesGuard } from 'src/auth/gaurds/roles.guard.ts/roles.guard.ts.guard';
import { UserService } from './user.service';
import { UserClientDto } from './dto';

@UseGuards(IsVerifiedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  // @Roles(ROLE.client)
  // @UseGuards(RolesGuard)

  @IsVerifiedCheck(true)
  @Get()
  testing() {
    return 'testing user';
  }

  @IsVerifiedCheck(true)
  @Get('me')
  me(@Req() req: Request) {
    return this.userService.current(req.user);
  }
  
  @IsVerifiedCheck(true)
  @Put('me')
  updateMe(@Req() req: Request, @Body() dto: UserClientDto) {
    return this.userService.upddateUser(req.user, dto);
  }
}
