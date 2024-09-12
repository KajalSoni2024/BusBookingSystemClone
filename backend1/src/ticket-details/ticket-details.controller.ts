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

@Controller('tickets')
export class TicketDetailsController {
  constructor(private readonly ticketDetailsService: TicketDetailsService) {}

  @Post('/createTicket')
  async create(@Request() req, @Response() res, @Body() data: any) {
    const userId = 1;
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

  @Get('/getBookedTicketDetails')
  async getBookedTicketDetails(@Query('ticketId') ticketId: any) {
    console.log('ticketId ', ticketId);
    return await this.ticketDetailsService.getBookedTicketDetails(ticketId);
  }

  @Get('/getBookedTickets')
  async getAllBookedTicketsByUser() {
    return await this.ticketDetailsService.getAllBookedTicketsByUser();
  }

  @Post('/cancelBookedTicket')
  async cancelBookedTicket(@Body() payload: any) {
    return await this.ticketDetailsService.cancelBookedTicket(payload);
  }

  @Get('/getAllUsersTickets')
  async getAllTicketsByUserId(@Query('userId') userId: number) {
    return this.ticketDetailsService.getAllTicketsByUserId(userId);
  }
  @Get('/getTicketDetailsById')
  async getTicketDetailsById(@Query('ticketId') ticketId: number) {
    return this.ticketDetailsService.getTicketDetailsById(ticketId);
  }
  @Get('/getTicketsByUserId')
  async getTicketsByUserId(@Query('userId') userId: number) {
    return this.ticketDetailsService.getTicketsByUserId(userId);
  }

  @Get('/getPassengersList')
  async getPassengersList(@Query() query: any) {
    console.log(query);
    return await this.ticketDetailsService.getPassengersList(query);
  }
}
