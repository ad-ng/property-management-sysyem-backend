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
  async current(user) {
    const currentUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    delete currentUser.password;
    delete currentUser.verificationCode;
    delete currentUser.createdAt;
    delete currentUser.updatedAt;
    return {
      message: 'user found successfully',
      user: currentUser,
    };
  }

  async upddateUser(user, dto) {
    try {
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
      delete currentUser.password;
      delete currentUser.verificationCode;
      delete currentUser.createdAt;
      delete currentUser.updatedAt;
      return {
        message: 'user updated successfully',
        currentUser,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new BadRequestException('email already taken');
        }
      }
      return error;
    }
  }

  async deleteUser(user) {
    const currentUser = await this.prisma.user.delete({
      where: { email: user.email },
    });
    return {
      message: 'user deleted successfully',
    };
  }

  async getAllUsers(query) {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const allUsers = await this.prisma.user.findMany({
      orderBy: [{ id: 'desc' }],
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      message: 'users found successfully',
      allUsers,
    };
  }

  async createUser(dto) {
    try {
      const hashedPassword = await argon.hash(dto.password);
      const newUser = await this.prisma.user.create({
        data: {
          password: hashedPassword,
          username: dto.username,
          email: dto.email,
          role: dto.role,
        },
      });
      return {
        message: 'user created successfully',
        newUser,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new BadRequestException('email already taken');
        }
      }
    }
  }

  async adminUpdateUser(dto) {
    try {
      const hashedPassword = await argon.hash(dto.password);
      const newUser = await this.prisma.user.update({
        where: { email: dto.email },
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
      return {
        message: 'user updated successfully',
        newUser,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new BadRequestException('email already taken');
        }
      }
    }
  }

  async adminDeleteUser(param) {
    const { email } = param;
    const checkUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!checkUser)
      throw new NotFoundException(`no user with email: ${email}  found !`);

    await this.prisma.user.delete({
      where: { email },
    });

    return {
      message: `user with email: ${email} deleted successfully !`,
    };
  }
}
