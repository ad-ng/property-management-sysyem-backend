import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { verMessage } from './messages/verification.message';
import { PrismaService } from 'src/prisma/prisma.service';
//import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}
  verificationCode = crypto.randomUUID().split('-')[0];

  emailTransporter() {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    return transporter;
  }

  async sendVer(user) {
    const verificationLink = `${process.env.BASE_URL}/verify/${user.email}?OTP=${this.verificationCode}`;
    const transporter = this.emailTransporter();
    const options: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reminder: Confirm your email address',
      html: verMessage(user, verificationLink, this.verificationCode),
    };
    try {
      const isMessageSent = await transporter.sendMail(options);
      await this.prisma.user.update({
        where: { email: user.email },
        data: {
          verificationCode: this.verificationCode
        }
      })
      return {
        message: 'email sent',
      };
    } catch (error) {
      throw new BadRequestException('incorrect email');
    }
  }

  async verifyOTP(query, email) {
    const { OTP } = query;
    const currentUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!currentUser)
      throw new NotFoundException('email not found !').getResponse();

    if (!currentUser.verificationCode)
      throw new NotFoundException('no otp found');

    if (currentUser.verificationCode != OTP)
      throw new BadRequestException('incorrect OTP');

    await this.prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
      },
    });
    return {
      message: 'verified successfully',
    };
  }
}
