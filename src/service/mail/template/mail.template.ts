import * as nodemailer from 'nodemailer';

function emailTransporter() {
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

export async function emailSender(to, subject, message) {
  const transporter = emailTransporter();
  const options: nodemailer.SendMailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: message,
  };
  const isMessageSent = await transporter.sendMail(options);
  return isMessageSent;
}
