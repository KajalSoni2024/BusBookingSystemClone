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
import { CreateEmailerDto } from './dto/create-emailer.dto';
import { UpdateEmailerDto } from './dto/update-emailer.dto';

@Controller('emailer')
export class EmailerController {
  constructor(private readonly emailerService: EmailerService) {}

  @Post('send')
  async sendEmail(@Body() body: { to: string; subject: string; text: string }) {
    const { to, subject, text } = body;
    await this.emailerService.sendMail(to, subject, text);
    return { message: 'Email sent successfully' };
  }
}
