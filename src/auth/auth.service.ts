import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto) {
    const currentUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!currentUser) throw new ForbiddenException('invalid credentials');
    const checkPassword: boolean = await argon.verify(
      currentUser.password,
      dto.password,
    );
    if (!checkPassword) throw new ForbiddenException('invalid credentials');
    return {
      access_token: await this.signToken(
        currentUser.id,
        currentUser.email,
        currentUser.username,
        currentUser.role,
        currentUser.isVerified
      ),
    };
  }

  async register(dto) {
    const hash: string = await argon.hash(dto.password);
    try {
      const currentUser = await this.prisma.user.create({
        data: {
          password: hash,
          email: dto.email,
          username: dto.username,
        },
      });
      return {
        access_token: await this.signToken(
          currentUser.id,
          currentUser.email,
          currentUser.role,
          currentUser.username,
          currentUser.isVerified
        ),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new BadRequestException('email already taken');
        }
      }
    }
  }

  async signToken(id: number, email: string, role: string, username: string, isVerified: boolean) {
    const payload = {
      sub: id,
      email,
      username,
      role,
      isVerified
    };
    return await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
