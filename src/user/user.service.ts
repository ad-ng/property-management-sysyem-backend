import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /*
     getting current user info who logged in
     using email extracted in jwt token
     this function is called in controller  @Get('me')---> me()
     _______________________________________________________________________________________
  */
  async current(user) {
    // getting current user
    const currentUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    /*
    since we can't expose all data to the user here are the
    data removed for the sake of security
    */
    delete currentUser.password; //removing password
    delete currentUser.verificationCode; //removing verification code
    delete currentUser.createdAt; // removing createdAt
    delete currentUser.updatedAt; // removing updatedAt

    // returning response to the user
    return {
      message: 'user found successfully',
      data: currentUser,
    };
  }

  /*
     updating current user info who logged in
     using email extracted in jwt token
     this function is called in controller  @Put('me')---> updateMe()
     _____________________________________updateUser__________________________________________________
  */
  async upddateUser(user, dto) {
    try {
      /*
      updating current user by data he provided in frontEnd
      in case he wants to update
      */
      const currentUser = await this.prisma.user.update({
        where: { email: user.email },
        data: {
          email: dto.email,
          fullname: dto.fullname,
          username: dto.username,
          gender: dto.gender,
          dob: dto.dob,
          phoneNumber: dto.phoneNumber,
          profileImg: dto.profileImg,
        },
      });

      /*
      in case updated before returning response we have 
      to remove some credentials and other unnecessary data
      */
      delete currentUser.password; //removing password
      delete currentUser.verificationCode; // removing verification code
      delete currentUser.createdAt; // removing createdAt
      delete currentUser.updatedAt; // removing updatedAt

      //returning response to the user
      return {
        message: 'user updated successfully',
        data: currentUser,
      };
    } catch (error) {
      /*
      error can be anything but in case it is a prisma client error
      we handle it like this  -----> error instanceof PrismaClientKnownRequestError
      */
      if (error instanceof PrismaClientKnownRequestError) {
        /*
        since email is unique you can't use same email as someone's else  
        */
        if (error.code == 'P2002') {
          throw new BadRequestException('email already taken');
        }
      }

      // in case error is not from prisma
      return error;
    }
  }

  /*
     deleting current logged in user
     using email extracted in jwt token
     this function is called in controller    @Delete('me') ----> deleteMe()
     _____________________________________deleteUser__________________________________________________
  */
  async deleteUser(user) {
    // deleting current user
    const currentUser = await this.prisma.user.delete({
      where: { email: user.email },
    });

    //returning the response
    return {
      message: 'user deleted successfully',
    };
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
     getting all user in the system 
     this function is called in controller    @Get('/admin/all')----> allUser
     ___________________________________________getAllUser__________________________________________________
  */
  async getAllUsers(query) {
    const limit = query.limit || 10; // extracting limit from query and make it 10 by default
    const page = query.page || 1; // extracting page from query and make it 1 by default

    //finding all users from db
    const allUsers = await this.prisma.user.findMany({
      orderBy: [{ id: 'desc' }], // sorting to arrange from latest registered user
      take: limit, // pagination
      skip: (page - 1) * limit, // pagination
    });

    // number of all users
    const totalUsers = await this.prisma.user.count();

    //returning response
    return {
      message: 'users found successfully',
      data: allUsers,
      currentPage: page,
      lastPage: Math.ceil(totalUsers / limit),
      total: totalUsers,
    };
  }

  /*
     getting one user from db using email 
     this function is called in controller    @Get('/admin/:email')----> userByEmail()
     ___________________________________________getUserByEmail________________________________________________
  */
  async getUserByEmail(param) {
    // getting email from request parameter
    const { email } = param;

    // finding that user
    const newUser = await this.prisma.user.findUnique({
      where: { email },
    });

    // in case that user was not found !
    if (!newUser)
      throw new NotFoundException(`no user with email: ${email} found !`);

    // returning response to the user
    return {
      message: 'user found successfully',
      data: newUser,
    };
  }

  /*
     admin creating a new user  
     this function is called in controller    @Post('/admin/add')---> addUser()
     ___________________________________________createUser________________________________________________
  */
  async createUser(dto) {
    try {
      //hashing an entered password
      const hashedPassword = await argon.hash(dto.password);

      //creating a user
      const newUser = await this.prisma.user.create({
        data: {
          password: hashedPassword,
          username: dto.username,
          email: dto.email,
          role: dto.role,
        },
      });

      // returning response to the user
      return {
        message: 'user created successfully',
        data: newUser,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // in case of violating uniqueness rule in user table
        if (error.code == 'P2002') {
          throw new BadRequestException('email already taken');
        }
      }
    }
  }

  /*
     admin updating a user  
     this function is called in controller    @Put('/admin/update')----> updateUser()
     ___________________________________________adminUpdateUser________________________________________________
  */
  async adminUpdateUser(dto, param) {
    const { email } = param;
    const checkUser = await this.prisma.user.findUnique({ where: { email } });

    if (!checkUser)
      throw new NotFoundException(`no user with email ${email} found`);

    // hashing entered password
    const hashedPassword = await argon.hash(`${dto.password}`);

    try {
      //updating user
      const newUser = await this.prisma.user.update({
        where: { email },
        data: {
          email: dto.email,
          password: hashedPassword,
          fullname: dto.fullname,
          username: dto.username,
          gender: dto.gender,
          dob: dto.dob,
          phoneNumber: dto.phoneNumber,
          profileImg: dto.profileImg,
          role: dto.role,
        },
      });

      // returning response to the user
      return {
        message: 'user updated successfully',
        data: newUser,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // in case of violating uniqueness rule in user table
        if (error.code == 'P2002') {
          throw new BadRequestException('email already taken');
        }
      }
    }
  }

  /*
     admin deleting a user  
     this function is called in controller    @Delete('/admin/:email') ----> adminDelete()
     ___________________________________________adminDeleteUser________________________________________________
  */
  async adminDeleteUser(param) {
    //extracting email from the request parameter
    const { email } = param;

    // finding a user, you are about to delete
    const checkUser = await this.prisma.user.findUnique({
      where: { email },
    });

    //in case user not found !
    if (!checkUser)
      throw new NotFoundException(`no user with email: ${email}  found !`);

    // after finding user now we delete a user
    await this.prisma.user.delete({
      where: { email },
    });

    //returning a response
    return {
      message: `user with email: ${email} deleted successfully !`,
    };
  }
}
