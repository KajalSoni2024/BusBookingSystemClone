import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketPayment } from './entities/payment.entity';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
import { TicketRefund } from './entities/ticketRefund.entity';
import { TicketDetailsModule } from 'src/ticket-details/ticket-details.module';
import { EmailerModule } from 'src/emailer/emailer.module';
import { CommonModule } from 'src/common/common.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([TicketPayment, TicketDetail, TicketRefund]),
    TicketDetailsModule,
    EmailerModule,
    CommonModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
