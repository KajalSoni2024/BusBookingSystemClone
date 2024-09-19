import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { CommonModule } from 'src/common/common.module';
import { Channels } from './entities/channel.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Message, Channels]), CommonModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
