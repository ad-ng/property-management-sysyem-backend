import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLE } from '@prisma/client';
import { query, Request, request } from 'express';
import { IsVerifiedCheck } from 'src/auth/decorators/isverified.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { IsVerifiedGuard } from 'src/auth/gaurds/roles.guard.ts/isverified.guard';
import { RolesGuard } from 'src/auth/gaurds/roles.guard.ts/roles.guard.ts.guard';
import { UserService } from './user.service';
import {
  DeleteUserDto,
  UserAdminUpdateDTO,
  UserClientDto,
  UserQueryDTO,
} from './dto';
import { adminUserDTO } from './dto/user.admin.dto';

@UseGuards(IsVerifiedGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /*
  ___________________________________________________________________________________________________________________
                                                      user.client
  */

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

  @IsVerifiedCheck(true)
  @Delete('me')
  deleteMe(@Req() req: Request) {
    return this.userService.deleteUser(req.user);
  }

  /*
  ___________________________________________________________________________________________________________________
                                                      user.admin
  */
  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Get('/admin/all')
  allUser(@Query() query: UserQueryDTO) {
    return this.userService.getAllUsers(query);
  }

  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Get('/admin/:email')
  userByEmail(@Param() param: DeleteUserDto) {
    return this.userService.getUserByEmail(param);
  }

  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Post('/admin/add')
  addUser(@Body() dto: adminUserDTO) {
    return this.userService.createUser(dto);
  }

  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Put('/admin/update')
  updateUser(@Body() dto: UserAdminUpdateDTO) {
    return this.userService.adminUpdateUser(dto);
  }

  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Delete('/admin/:email')
  adminDelete(@Param() param: DeleteUserDto) {
    return this.userService.adminDeleteUser(param);
  }
}
