import {
  Controller,
  Post,
  Body,
  Request,
  Response,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';

@Controller()
export class PaymentsController {
  constructor(private PaymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/makePayment')
  async create(@Request() req, @Response() res, @Body() paymentData: any) {
    const user = req.user;
    const result = await this.PaymentsService.makePayment(paymentData, user);
    res.status(HttpStatus.OK).json(result);
  }
}
