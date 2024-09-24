import { Module } from '@nestjs/common';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passengers } from './entities/passenger.entity';
import { BusSeats } from 'src/bus-details/entities/bus-seats.entity';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
import { BusDetail } from 'src/bus-details/entities/bus-detail.entity';
import { CommonModule } from 'src/common/common.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Passengers, BusSeats, TicketDetail, BusDetail]),
    CommonModule,
  ],
  controllers: [PassengerController],
  providers: [PassengerService],
  exports: [PassengerService],
})
export class PassengerModule {}
