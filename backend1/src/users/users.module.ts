import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { User } from './entities/users.entity';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TicketDetail])],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
