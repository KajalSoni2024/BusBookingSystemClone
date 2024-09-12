import { Module } from '@nestjs/common';
import { BusDetailsService } from './bus-details.service';
import { BusDetailsController } from './bus-details.controller';
import { BusDetail } from './entities/bus-detail.entity';
import { BusSeats } from './entities/bus-seats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketDetailsModule } from 'src/ticket-details/ticket-details.module';
import { PassengerModule } from 'src/passenger/passenger.module';
import { ConductorDetail } from 'src/conductor-details/entities/conductor-detail.entity';
import { BusRoute } from 'src/bus-routes/entities/bus-route.entity';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BusDetail,
      BusSeats,
      ConductorDetail,
      BusRoute,
      TicketDetail,
    ]),
    TicketDetailsModule,
    PassengerModule,
  ],
  controllers: [BusDetailsController],
  providers: [BusDetailsService],
  exports: [BusDetailsService],
})
export class BusDetailsModule {}
