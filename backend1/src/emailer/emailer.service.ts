import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';
@Injectable()
export class EmailerService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Replace with your SMTP server
      port: 587, // Replace with your SMTP port
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'ks8995943@gmail.com', // Replace with your email
        pass: 'your-email-password', // Replace with your email password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: '"Your App Name" <your-email@example.com>',
      to,
      subject,
      text,
    });
    console.log('Message sent: %s', info.messageId);
  }
}
