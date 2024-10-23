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
import { CommonModule } from 'src/common/common.module';
import { ConductorAttendance } from './entities/Attendance.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      TicketDetail,
      ForgetPassRequest,
      TicketRefund,
      ConductorAttendance,
    ]),
    EmailerModule,
    MessagesModule,
    CommonModule,
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
