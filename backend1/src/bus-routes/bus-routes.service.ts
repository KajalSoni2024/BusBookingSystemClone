import { Injectable } from '@nestjs/common';
import { CreateBusRouteDto } from './dto/create-bus-route.dto';
import { UpdateBusRouteDto } from './dto/update-bus-route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BusRoute } from './entities/bus-route.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BusRoutesService {
  constructor(
    @InjectRepository(BusRoute)
    private busRouteRepo: Repository<BusRoute>,
  ) {}
  async create(createBusRouteDto: any): Promise<any> {
    const response = await this.busRouteRepo.manager.transaction(
      async (entityManager) => {
        return entityManager.save(BusRoute, createBusRouteDto.busRouteDetail);
      },
    );
    return response;
  }
}
