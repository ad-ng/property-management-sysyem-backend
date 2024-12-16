import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { verMessage } from './messages/verification.message';
//import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class VerificationService {
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
      html: verMessage(user,verificationLink,this.verificationCode),
    };
    try {
      const isMessageSent = await transporter.sendMail(options);
      return {
        message: 'email sent'
      }
    } catch (error) {
        throw new BadRequestException('incorrect email')
    }  
  }
}
