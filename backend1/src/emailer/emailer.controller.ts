import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmailerService } from './emailer.service';

@Controller('emailer')
export class EmailerController {
  constructor(private readonly emailerService: EmailerService) {}

  @Post('/sendEmail')
  async sendEmail(@Body() body: { to: string; subject: string; text: any }) {
    const { to, subject, text } = body;
    await this.emailerService.sendMail(to, subject, text);
    return { message: 'Email sent successfully' };
  }
}
