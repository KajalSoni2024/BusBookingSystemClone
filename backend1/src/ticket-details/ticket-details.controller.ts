import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  Response,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TicketDetailsService } from './ticket-details.service';
import { CreateTicketDetailDto } from './dto/create-ticket-detail.dto';
import { UpdateTicketDetailDto } from './dto/update-ticket-detail.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { EmailerService } from 'src/emailer/emailer.service';
@Controller('tickets')
export class TicketDetailsController {
  constructor(
    private readonly ticketDetailsService: TicketDetailsService,
    private readonly emailerService: EmailerService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('/createTicket')
  async create(@Request() req: any, @Response() res: any, @Body() data: any) {
    const userId = req.user.userId;
    const payload = {
      user: userId,
      source: data.source,
      destination: data.destination,
      ticketDate: data.ticketDate,
      busDetail: data.busDetail,
    };
    const result = await this.ticketDetailsService.createTicket(payload);
    res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getBookedTicketDetails')
  async getBookedTicketDetails(@Query('ticketId') ticketId: any) {
    console.log('ticketId ', ticketId);
    return await this.ticketDetailsService.getBookedTicketDetails(ticketId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getBookedTickets')
  async getAllBookedTicketsByUser(@Request() req: any) {
    const userId = req.user.userId;
    return await this.ticketDetailsService.getAllBookedTicketsByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/cancelBookedTicket')
  async cancelBookedTicket(@Body() payload: any) {
    console.log('sdfsdfsdgtsdgrfgtdyhfgh', payload);
    return await this.ticketDetailsService.cancelBookedTicket(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAllUsersTickets')
  async getAllTicketsByUserId(@Query('userId') userId: number) {
    return this.ticketDetailsService.getAllTicketsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getTicketDetailsById')
  async getTicketDetailsById(@Query('ticketId') ticketId: number) {
    return this.ticketDetailsService.getTicketDetailsById(ticketId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getTicketsByUserId')
  async getTicketsByUserId(@Query('userId') userId: number) {
    return this.ticketDetailsService.getTicketsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getPassengersList')
  async getPassengersList(@Query() query: any) {
    console.log(query);
    return await this.ticketDetailsService.getPassengersList(query);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post('/generateOtpToCancelTicket')
  async generateOtpToCancelTicket(@Body() body: any, @Request() req: any) {
    console.log('sdfgsdfgdfg', body);
    const userId = req.user.userId;
    const result = await this.ticketDetailsService.generateOtpToCancelTicket(
      body,
      userId,
    );
    if (result == false) {
      return false;
    } else {
      const txt = 'Enter the below given otp to cancel your ticket';
      const emailResult = await this.emailerService.sendMail(
        req.user.email,
        txt,
        result,
      );
      console.log(emailResult);
      return true;
    }
  }
}
