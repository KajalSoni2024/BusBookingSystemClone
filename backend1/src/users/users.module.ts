import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { User } from './entities/users.entity';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
import { ForgetPassRequest } from './entities/forget-pass-req.entity';
import { EmailerModule } from 'src/emailer/emailer.module';
import { TicketRefund } from 'src/payments/entities/ticketRefund.entity';
import { MessagesModule } from 'src/messages/messages.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      TicketDetail,
      ForgetPassRequest,
      TicketRefund,
    ]),
    EmailerModule,
    MessagesModule,
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
