import {
  Controller,
  Post,
  Body,
  Request,
  Response,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private PaymentsService: PaymentsService) {}

  @Post('/makePayment')
  async create(@Request() req, @Response() res, @Body() paymentData: any) {
    const result = await this.PaymentsService.makePayment(paymentData);
    res.status(HttpStatus.OK).json(result);
  }
}
