import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { VerificationService } from 'src/verification/verification.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private verification: VerificationService,
  ) {}

  // log in  service
  async login(dto) {
    //finding a user using entered email
    const currentUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // in case no user found with given email
    if (!currentUser) throw new ForbiddenException('invalid credentials');

    // comparing entered password with the hashed password from db
    const checkPassword: boolean = await argon.verify(
      currentUser.password,
      dto.password,
    );

    // in case entered password does not match with hashed password in db
    if (!checkPassword) throw new ForbiddenException('invalid credentials');

    // returning response to the user
    return {
      // generating and returning a jwt using signToken() function we created at the bottom of this class
      access_token: await this.signToken(
        currentUser.id,
        currentUser.email,
        currentUser.role,
        currentUser.username,
        currentUser.isVerified,
      ),
    };
  }

  // registering a user function
  async register(dto) {
    //hashing the entered password for security purpose
    const hash: string = await argon.hash(dto.password);

    try {
      // creating and saving a user in db
      const currentUser = await this.prisma.user.create({
        data: {
          password: hash, // using hashed password rather than plain text password
          email: dto.email,
          username: dto.username,
          role: dto.role,
        },
      });

      // sending verification code to the entered email address of a user
      this.verification.sendVer(currentUser);

      // return response to the user
      return {
        access_token: await this.signToken(
          currentUser.id,
          currentUser.email,
          currentUser.role,
          currentUser.username,
          currentUser.isVerified,
        ),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // in case auser is trying to use an already registered email
        if (error.code == 'P2002') {
          throw new BadRequestException('email already taken');
        }
      }
    }
  }

  // a function to generate a jwt
  async signToken(
    id: number,
    email: string,
    role: string,
    username: string,
    isVerified: boolean,
  ) {
    // data we want to include in a jwt
    const payload = {
      sub: id,
      email,
      role,
      username,
      isVerified,
    };
    return await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
