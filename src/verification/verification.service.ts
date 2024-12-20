import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { verMessage } from '../service/mail/messages/verification.message';
import { PrismaService } from 'src/prisma/prisma.service';
import { emailSender } from 'src/service/mail/template/mail.template';
//import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}
  verificationCode = crypto.randomUUID().split('-')[0];

  // a function to send a verification code
  async sendVer(user) {
    // creating  verification link
    const verificationLink = `${process.env.BASE_URL}/verify/${user.email}?OTP=${this.verificationCode}`;

    // initializing data for sending email
    const to = user.email; // email to send to { user's email }
    const subject = 'Reminder: Confirm your email address'; // subject of the message
    const message = verMessage(user, verificationLink, this.verificationCode); // email

    try {
      // a function to send email -----> import { emailSender } from 'src/service/mail/template/mail.template';
      emailSender(to, subject, message);

      // saving verification code created, to the database
      await this.prisma.user.update({
        where: { email: user.email },
        data: {
          verificationCode: this.verificationCode,
        },
      });

      //returning response to the user
      return {
        message: 'email sent',
      };
    } catch (error) {
      // in case email is not sent
      throw new BadRequestException('incorrect email');
    }
  }

  // verifying otp
  async verifyOTP(query, email) {
    // extracting otp from the request query
    const { OTP } = query;

    // finding user you are about to verify
    const currentUser = await this.prisma.user.findUnique({
      where: { email },
    });

    // in case user is not found
    if (!currentUser) throw new NotFoundException('email not found !');

    // in case not otp provided
    if (!currentUser.verificationCode)
      throw new NotFoundException('no otp found');

    // in case otp entered does not match the current verification code in db
    if (currentUser.verificationCode != OTP)
      throw new BadRequestException('incorrect OTP');

    // updating isVerified to TRUE
    await this.prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
      },
    });

    // returning response to the user
    return {
      message: 'verified successfully',
    };
  }
}
