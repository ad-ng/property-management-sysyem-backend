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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  swaggerForbidden,
  swaggerNotFound,
  swaggerOk,
  swaggerUnAuthorized,
} from 'src/service/swagger/openapi';

@ApiBearerAuth()
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

  @ApiOperation({
    description: 'getting current user info using id from jwt',
    summary: 'current user',
  })
  @swaggerUnAuthorized()
  @swaggerOk('ok response', {
    id: 4,
    email: 'Merritt_Senger@hotmail.com',
    fullname: 'Darrell Rice-Aufderhar',
    username: 'Reuben_Fahey65',
    gender: 'female',
    dob: '1960-06-07T16:15:04.416Z',
    phoneNumber: '(468) 912-2438 x3019',
    role: 'owner',
    isVerified: true,
    profileImg: null,
  })
  @swaggerForbidden()
  @IsVerifiedCheck(true)
  @Get('me') // route ----> GET  /user/me
  me(@Req() req: Request) {
    return this.userService.current(req.user);
  }

  @ApiOperation({
    summary: 'updating',
    description: 'current user updating his info',
  })
  @swaggerUnAuthorized()
  @swaggerForbidden()
  @swaggerOk('user updated successfully', {
    id: 4,
    email: 'johndoe@hotmail.com',
    fullname: 'john doe',
    username: 'john',
    gender: 'male',
    dob: '1960-06-07T16:15:04.416Z',
    phoneNumber: '08999866654',
    role: 'owner',
    isVerified: true,
    profileImg: null,
  })
  @ApiBadRequestResponse({
    description: 'sending already registered email',
    schema: {
      example: {
        message: 'email already taken',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @IsVerifiedCheck(true)
  @Put('me') // route ----> PUT  /user/me
  updateMe(@Req() req: Request, @Body() dto: UserClientDto) {
    return this.userService.upddateUser(req.user, dto);
  }

  @ApiOperation({
    summary: 'deleting account',
    description: 'deleting current account',
  })
  @swaggerUnAuthorized()
  @swaggerForbidden()
  @ApiOkResponse({
    description: 'when user is actually deleted',
    schema: {
      example: {
        message: 'user deleted successfully',
      },
    },
  })
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

  @ApiOperation({
    summary: 'fetching all users',
  })
  @swaggerUnAuthorized()
  @swaggerForbidden()
  @ApiOkResponse({
    schema: {
      example: {
        message: 'users found successfully',
        data: [
          {
            id: 7,
            email: 'Carmen_Bergnaum6@hotmail.com',
            password: 'test@123',
            fullname: 'Cary Robel',
            username: 'Joy.Schinner',
            gender: 'male',
            dob: '1966-12-16T22:06:46.281Z',
            phoneNumber: '758.533.0767 x9979',
            role: 'client',
            isVerified: false,
            profileImg: null,
            verificationCode: '978-0-86978-794-6',
            updatedAt: '2024-12-19T13:39:39.082Z',
            createdAt: '2024-12-19T13:39:39.082Z',
          },
          {
            id: 6,
            email: 'Samir.Collier30@hotmail.com',
            password: 'test@123',
            fullname: 'Blanca Hane',
            username: 'Graham.Stamm72',
            gender: 'female',
            dob: '1971-06-02T19:29:38.605Z',
            phoneNumber: '(824) 794-4822 x4066',
            role: 'owner',
            isVerified: true,
            profileImg: null,
            verificationCode: '978-0-14-686240-3',
            updatedAt: '2024-12-19T13:39:39.079Z',
            createdAt: '2024-12-19T13:39:39.079Z',
          },
          {
            id: 5,
            email: 'Johnnie_Jaskolski@yahoo.com',
            password: 'test@123',
            fullname: 'Debra Cronin',
            username: 'Gertrude_Windler-OKon',
            gender: 'male',
            dob: '1968-08-12T04:33:41.457Z',
            phoneNumber: '(338) 824-5877 x386',
            role: 'client',
            isVerified: true,
            profileImg: null,
            verificationCode: '978-0-15-819483-7',
            updatedAt: '2024-12-19T13:39:39.077Z',
            createdAt: '2024-12-19T13:39:39.077Z',
          },
        ],
        currentPage: 3,
        lastPage: 4,
        total: 11,
      },
    },
  })
  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Get('/admin/all') //route ----> GET  /user/admin/all
  allUser(@Query() query: UserQueryDTO) {
    return this.userService.getAllUsers(query);
  }

  @ApiOperation({
    summary: 'fetching a user by email',
  })
  @swaggerUnAuthorized()
  @swaggerForbidden()
  @swaggerNotFound('no user with email {email} found !')
  @swaggerOk('johndoe@hotmail.com', {
    message: 'user found successfully',
    data: {
      id: 4,
      email: 'johndoe@hotmail.com',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$u5ZwC7GEvSRoJ/tva+MnPg$6pDqoQoA/KV9r0BbwPE8YWA65nE2eUdSahhOImIEIxo',
      fullname: 'john doe',
      username: 'john',
      gender: 'male',
      dob: '1960-06-07T16:15:04.416Z',
      phoneNumber: '08999866654',
      role: 'admin',
      isVerified: true,
      profileImg: null,
      verificationCode: '978-0-8217-7823-4',
      updatedAt: '2024-12-20T12:40:31.268Z',
      createdAt: '2024-12-19T13:39:39.070Z',
    },
  })
  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Get('/admin/:email') //route ----> GET  /user/admin/{email}
  userByEmail(@Param() param: DeleteUserDto) {
    return this.userService.getUserByEmail(param);
  }

  @ApiOperation({
    summary: 'add a user',
  })
  @swaggerUnAuthorized()
  @swaggerForbidden()
  @ApiCreatedResponse({
    schema: {
      example: {
        message: 'user created successfully',
        data: {
          id: 15,
          email: 'Darby20@hotmail.com ',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$S/yUiisWw1xn7CBiFD4wNQ$+EB56R9eS9kPaNLGr47UjZFPjLPGANhiuOLqj3Vg7Ms',
          fullname: null,
          username: 'Joy.Schinner',
          gender: null,
          dob: null,
          phoneNumber: null,
          role: 'admin',
          isVerified: false,
          profileImg: null,
          verificationCode: null,
          updatedAt: '2024-12-20T13:35:52.432Z',
          createdAt: '2024-12-20T13:35:52.432Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        message: 'email already taken',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Post('/admin/add') //route ----> POST  /user/admin/add
  addUser(@Body() dto: adminUserDTO) {
    return this.userService.createUser(dto);
  }

  @swaggerUnAuthorized()
  @swaggerForbidden()
  @swaggerNotFound('no user with email {email} found !')
  @ApiBadRequestResponse({
    schema: {
      example: {
        message: 'email already taken',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Put('/admin/update/:email') //route ----> PUT  /user/admin/update
  updateUser(@Body() dto: UserAdminUpdateDTO,@Param() param: DeleteUserDto) {
    return this.userService.adminUpdateUser(dto,param);
  }

  @swaggerUnAuthorized()
  @swaggerForbidden()
  @swaggerNotFound('no user with email {email} found !')
  @ApiOkResponse({
    schema: {
      example: {
        message: 'user with email {email} deleted successfully',
      },
    },
  })
  @Roles(ROLE.admin)
  @UseGuards(RolesGuard)
  @IsVerifiedCheck(true)
  @Delete('/admin/:email') //route ----> DELETE  /user/admin/{email}
  adminDelete(@Param() param: DeleteUserDto) {
    return this.userService.adminDeleteUser(param);
  }
}
