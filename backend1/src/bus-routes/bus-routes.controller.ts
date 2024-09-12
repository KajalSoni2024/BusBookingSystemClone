import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Response,
  HttpStatus,
} from '@nestjs/common';
import { BusRoutesService } from './bus-routes.service';
import { UpdateBusRouteDto } from './dto/update-bus-route.dto';

@Controller()
export class BusRoutesController {
  constructor(private readonly busRoutesService: BusRoutesService) {}

  @Post('/addBusRoute')
  async create(
    @Request() req,
    @Response() res,
    @Body() createBusRouteDto: any,
  ) {
    const result = await this.busRoutesService.create(createBusRouteDto);
    res.status(HttpStatus.OK).json(result);
  }
}
