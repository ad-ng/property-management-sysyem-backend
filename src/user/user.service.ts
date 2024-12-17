import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async deleteUser (user){
    const currentUser = await this.prisma.user.delete({
        where: { email: user.email }
    })
    return {
        message: 'user deleted successfully'
    }
  }
}
