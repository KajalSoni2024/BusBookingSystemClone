import { Module } from '@nestjs/common';
import { BusRoutesService } from './bus-routes.service';
import { BusRoutesController } from './bus-routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusRoute } from './entities/bus-route.entity';
@Module({
  imports: [TypeOrmModule.forFeature([BusRoute])],
  controllers: [BusRoutesController],
  providers: [BusRoutesService],
})
export class BusRoutesModule {}
