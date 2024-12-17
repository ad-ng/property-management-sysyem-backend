import { Injectable } from '@nestjs/common';
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
}
