import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  Response,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BusDetailsService } from './bus-details.service';
import { CreateBusDetailDto } from './dto/create-bus-detail.dto';
import { UpdateBusDetailDto } from './dto/update-bus-detail.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { TicketDetailsService } from 'src/ticket-details/ticket-details.service';
import { PassengerService } from 'src/passenger/passenger.service';
@Controller()
export class BusDetailsController {
  constructor(
    private readonly busDetailsService: BusDetailsService,
    private readonly ticketDetailService: TicketDetailsService,
    private readonly passengerService: PassengerService,
  ) {}

  @Post('/addBusDetails')
  create(@Body() createBusDetailDto: any) {
    return this.busDetailsService.create(createBusDetailDto);
  }

  @Get('/getBusByRoute')
  async getBuses(@Request() req, @Response() res, @Query() query) {
    const result = await this.busDetailsService.getBusesByRoute(query);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('/getAvailableSeats')
  async getAvailSeats(
    @Request() req,
    @Response() res,
    @Query('busId') busId: number,
  ) {
    const result = await this.busDetailsService.getAvailSeats(busId);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('/getBusSeatsById')
  findBusSeatsByBusId(@Query('busId') busId: number) {
    return this.busDetailsService.getBusSeatsByBusId(busId);
  }
  @Get('/getbusesWithoutConductors')
  findBusesWithoutConductors() {
    return this.busDetailsService.getBusesWithoutConductors();
  }
  @Get('/getAllBuses')
  async getAllBuses() {
    return await this.busDetailsService.getAllBuses();
  }
  @Get('getBusDetailsById')
  async getBusDetailsById(@Query('busId') busId: number) {
    return await this.busDetailsService.getBusDetailsById(busId);
  }

  @Post('/updateBusDetails')
  async updateBusDetails(@Body() busDetails: any) {
    return await this.busDetailsService.updateBusDetails(busDetails);
  }

  @Post('/updateBusConductorDetails')
  async updateBusConductorDetails(@Body() payload: any) {
    return await this.busDetailsService.updateBusConductorDetails(payload);
  }

  @Post('/updateBusRouteDetails')
  async updateBusRouteDetails(@Body() payload: any) {
    return await this.busDetailsService.updateBusRouteDetails(payload);
  }

  @Post('/addConductorDetails')
  async addConductorDetail(@Body() payload: any) {
    return this.busDetailsService.addConductorDetails(payload);
  }

  @Get('/getAssignedBuses')
  async getAssignedBuses() {
    const userId = 3;
    const result = await this.busDetailsService.getAssignedBusesById(userId);
    return result;
  }
}
