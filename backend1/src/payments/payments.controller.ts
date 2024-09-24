import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Request,
  Response,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { EmailerService } from 'src/emailer/emailer.service';
import { TicketDetailsService } from 'src/ticket-details/ticket-details.service';
@Controller()
export class PaymentsController {
  constructor(
    private PaymentsService: PaymentsService,
    private ticketDetailsService: TicketDetailsService,
    private emailerService: EmailerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/makePayment')
  async create(
    @Request() req: any,
    @Response() res: any,
    @Body() paymentData: any,
  ) {
    const user = req.user;
    const result = await this.PaymentsService.makePayment(paymentData, user);
    res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/payRefund')
  async payRefund(
    @Request() req: any,
    @Response() res: any,
    @Body() payload: any,
  ) {
    const user = req.user;
    const result = await this.PaymentsService.payRefund(payload, user);
    console.log(result);
    res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/setPaymentStatusSuccess')
  async setPaymentStatusSuccess(@Query('ticketId') ticketId: number) {
    const result = await this.PaymentsService.setPaymentStatusSuccess(ticketId);
    console.log(result);
    if (result) {
      const ticket =
        await this.ticketDetailsService.getTicketByTicketIdWithDeletedTrue(
          ticketId,
        );
      console.log(ticket);
      const email = ticket.user.email;
      const txt = `Your Refund for the cancelation of your ticket of bus name ${ticket.busDetail.busName} scheduled on ${ticket.ticketDate} has been transferred to your account`;
      const subject = 'Refund Of ticket Cancellation';
      const emailMessageId = await this.emailerService.sendMail(
        email,
        subject,
        txt,
      );
      console.log(emailMessageId);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getTotalTicketsCancelledToday')
  async getTotalTicketsCancelledToday() {
    return await this.PaymentsService.getTotalTicketsCancelledToday();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getTotalTicketsCancelledPerMonth')
  async getTotalTicketsCancelledPerMonth() {
    return await this.PaymentsService.getTotalTicketsCancelledPerMonth();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getTotalCancelledTicketsWithPendingRefund')
  async getTotalCancelledTicketsWithPendingRefund() {
    return await this.PaymentsService.getTotalCancelledTicketsWithPendingRefund();
  }
}
