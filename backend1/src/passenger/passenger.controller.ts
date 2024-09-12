import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Request,
  Response,
  HttpStatus,
} from '@nestjs/common';
import { PassengerService } from './passenger.service';

@Controller()
export class PassengerController {
  constructor(private passengerService: PassengerService) {}
  @Post('/addPassengers')
  async create(@Request() req, @Response() res, @Body() data: any) {
    const result = await this.passengerService.addPassengers(data);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('/updatePassengersTraveledStatus')
  async updatePassengersTraveledStatus(@Query() query: any) {
    return await this.passengerService.updatePassengersTraveledStatus(query);
  }
}
