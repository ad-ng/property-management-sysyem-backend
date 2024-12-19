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
  _______________________________________________________________________________________________________________
  :::::::::::::::::::::::::::::::::::::::::|                      |::::::::::::::::::::::::::::::::::::::::::::::
  :::::::::::::::::::::::::::::::::::::::::| start of client role |::::::::::::::::::::::::::::::::::::::::::::::
  :::::::::::::::::::::::::::::::::::::::::|                      |::::::::::::::::::::::::::::::::::::::::::::::
  */

  /*
  @IsVerifiedCheck(true) : this is for protecting routes to make sure that on verified user
  .                      can access them
  */

  @IsVerifiedCheck(true)
  @Get('me') // route ----> GET  /user/me
  me(@Req() req: Request) {
    return this.userService.current(req.user);
  }

  @IsVerifiedCheck(true)
  @Put('me') // route ----> PUT  /user/me
  updateMe(@Req() req: Request, @Body() dto: UserClientDto) {
    return this.userService.upddateUser(req.user, dto);
  }

  @IsVerifiedCheck(true)
  @Delete('me') // route ----> DELETE  /user/me
  deleteMe(@Req() req: Request) {
    return this.userService.deleteUser(req.user);
  }

  /*
  :::::::::::::::::::::::::::::::::::::::::|                    |::::::::::::::::::::::::::::::::::::::::::::::
  :::::::::::::::::::::::::::::::::::::::::| end of client role |::::::::::::::::::::::::::::::::::::::::::::::
  :::::::::::::::::::::::::::::::::::::::::|____________________|:::::::::::::::::::::::::::::::::::::::::::::::
  */
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /*
________________________________________________________________________________________________________________
  .........................................| start of admin role |..............................................
  _________________________________________|                     |______________________________________________
  */

    /*
  @IsVerifiedCheck(true) : this is for protecting routes to make sure that on verified user
  .                      can access them

  @Roles(ROLE.admin)      // protecting routes with admin role
  @UseGuards(RolesGuard)  // protecting routes with admin role
  */

  @Roles(ROLE.admin)
  @UseGuards(RolesGuard) 
  @IsVerifiedCheck(true)
  @Get('/admin/all') //route ----> GET  /user/admin/all
  allUser(@Query() query: UserQueryDTO) {
    return this.userService.getAllUsers(query);
  }

  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Get('/admin/:email') //route ----> GET  /user/admin/{email}
  userByEmail(@Param() param: DeleteUserDto) {
    return this.userService.getUserByEmail(param);
  }

  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Post('/admin/add') //route ----> POST  /user/admin/add
  addUser(@Body() dto: adminUserDTO) {
    return this.userService.createUser(dto);
  }

  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Put('/admin/update') //route ----> PUT  /user/admin/update
  updateUser(@Body() dto: UserAdminUpdateDTO) {
    return this.userService.adminUpdateUser(dto);
  }

  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Delete('/admin/:email') //route ----> DELETE  /user/admin/{email}
  adminDelete(@Param() param: DeleteUserDto) {
    return this.userService.adminDeleteUser(param);
  }
}
