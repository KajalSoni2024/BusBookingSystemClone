import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassengerModule } from './passenger/passenger.module';
import { PaymentsModule } from './payments/payments.module';
import { BusDetailsModule } from './bus-details/bus-details.module';
import { BusRoutesModule } from './bus-routes/bus-routes.module';
import { ConductorDetailsModule } from './conductor-details/conductor-details.module';
import { TicketDetailsModule } from './ticket-details/ticket-details.module';
import { BusDetail } from './bus-details/entities/bus-detail.entity';
import { BusRoute } from './bus-routes/entities/bus-route.entity';
import { ConductorDetail } from './conductor-details/entities/conductor-detail.entity';
import { TicketPayment } from './payments/entities/payment.entity';
import { Passengers } from './passenger/entities/passenger.entity';
import { TicketDetail } from './ticket-details/entities/ticket-detail.entity';
import { BusSeats } from './bus-details/entities/bus-seats.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { EmailerModule } from './emailer/emailer.module';
import { ForgetPassRequest } from './users/entities/forget-pass-req.entity';
import { CancelTicketRequest } from './ticket-details/entities/cancel-ticket-req.entity';
import { TicketRefund } from './payments/entities/ticketRefund.entity';
import { StateAndCitiesModule } from './state-and-cities/state-and-cities.module';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/entities/message.entity';
import { CommonModule } from './common/common.module';
import { Channels } from './messages/entities/channel.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Chits@123.',
      database: process.env.DATABASE,
      entities: [
        User,
        BusDetail,
        BusRoute,
        ConductorDetail,
        Passengers,
        TicketPayment,
        TicketDetail,
        BusSeats,
        ForgetPassRequest,
        CancelTicketRequest,
        TicketRefund,
        Message,
        Channels,
      ],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    PassengerModule,
    PaymentsModule,
    BusDetailsModule,
    BusRoutesModule,
    ConductorDetailsModule,
    TicketDetailsModule,
    EmailerModule,
    StateAndCitiesModule,
    MessagesModule,
    CommonModule,
  ],
})
export class AppModule {}
