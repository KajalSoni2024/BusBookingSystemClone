import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Request,
  Response,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';

@Controller()
export class PassengerController {
  constructor(private passengerService: PassengerService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/addPassengers')
  async create(@Request() req, @Response() res, @Body() data: any) {
    const result = await this.passengerService.addPassengers(data);
    res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/updatePassengersTraveledStatus')
  async updatePassengersTraveledStatus(@Query() query: any) {
    return await this.passengerService.updatePassengersTraveledStatus(query);
  }

  @Get('/getTotalPassengersTraveledToday')
  async getTotalPassengersTraveledToday() {
    return await this.passengerService.getTotalPassengersTraveledToday();
  }

  @Get('/getPassengersTraveledPerMonth')
  async getPassengersTraveledPerMonth() {
    return await this.passengerService.getPassengersTraveledPerMonth();
  }
}
