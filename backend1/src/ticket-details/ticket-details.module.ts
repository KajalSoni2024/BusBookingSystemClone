import { Module } from '@nestjs/common';
import { TicketDetailsService } from './ticket-details.service';
import { TicketDetailsController } from './ticket-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketDetail } from './entities/ticket-detail.entity';
import { Passengers } from 'src/passenger/entities/passenger.entity';
import { TicketPayment } from 'src/payments/entities/payment.entity';
import { BusSeats } from 'src/bus-details/entities/bus-seats.entity';
import { BusDetail } from 'src/bus-details/entities/bus-detail.entity';
import { CancelTicketRequest } from './entities/cancel-ticket-req.entity';
import { EmailerModule } from 'src/emailer/emailer.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      TicketDetail,
      Passengers,
      TicketPayment,
      BusSeats,
      BusDetail,
      CancelTicketRequest,
    ]),
    EmailerModule,
  ],
  controllers: [TicketDetailsController],
  providers: [TicketDetailsService],
  exports: [TicketDetailsService],
})
export class TicketDetailsModule {}
