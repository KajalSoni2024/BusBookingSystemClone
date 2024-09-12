import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketPayment } from './entities/payment.entity';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketPayment, TicketDetail])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
