import { Module } from '@nestjs/common';
import { PusherService } from './services/pusher.service';
import { CommonController } from './common.controller';

@Module({
  controllers: [CommonController],
  providers: [PusherService],
  exports: [PusherService],
})
export class CommonModule {}
