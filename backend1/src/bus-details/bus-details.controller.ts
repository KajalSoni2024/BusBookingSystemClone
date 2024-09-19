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
import { UsersService } from 'src/users/users.service';
@Controller()
export class BusDetailsController {
  constructor(
    private readonly busDetailsService: BusDetailsService,
    private readonly ticketDetailService: TicketDetailsService,
    private readonly passengerService: PassengerService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/addBusDetails')
  create(@Body() createBusDetailDto: any) {
    return this.busDetailsService.create(createBusDetailDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getBusByRoute')
  async getBuses(@Request() req, @Response() res, @Query() query) {
    const result = await this.busDetailsService.getBusesByRoute(query);
    res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAvailableSeats')
  async getAvailSeats(
    @Request() req,
    @Response() res,
    @Query('busId') busId: number,
  ) {
    const result = await this.busDetailsService.getAvailSeats(busId);
    res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getBusSeatsById')
  findBusSeatsByBusId(@Query('busId') busId: number) {
    return this.busDetailsService.getBusSeatsByBusId(busId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getbusesWithoutConductors')
  findBusesWithoutConductors() {
    return this.busDetailsService.getBusesWithoutConductors();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAllBuses')
  async getAllBuses(@Request() req: any) {
    console.log(req);
    return await this.busDetailsService.getAllBuses();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getBusDetailsById')
  async getBusDetailsById(@Query('busId') busId: number) {
    return await this.busDetailsService.getBusDetailsById(busId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateBusDetails')
  async updateBusDetails(@Body() busDetails: any) {
    return await this.busDetailsService.updateBusDetails(busDetails);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateBusConductorDetails')
  async updateBusConductorDetails(@Body() payload: any) {
    return await this.busDetailsService.updateBusConductorDetails(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateBusRouteDetails')
  async updateBusRouteDetails(@Body() payload: any) {
    return await this.busDetailsService.updateBusRouteDetails(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/addConductorDetails')
  async addConductorDetail(@Body() payload: any) {
    const { conductorId, driverId } = payload;
    try {
      const result = await this.busDetailsService.addConductorDetails(payload);
      if (result) {
        await this.userService.setIsAssignedToTrue(conductorId, driverId);
      }
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAssignedBuses')
  async getAssignedBuses(@Request() req: any) {
    const user = req.user;
    const result = await this.busDetailsService.getAssignedBusesById(
      user.userId,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getBusDetailByBusName')
  async getBusDetailByBusName(@Query() query: any) {
    return await this.busDetailsService.getBusDetailByBusName(query);
  }
}
