import { Injectable, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { IsNull, Not, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PusherService } from 'src/common/services/pusher.service';
import { Channels } from './entities/channel.entity';
import { channel } from 'diagnostics_channel';
@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(Channels) private ChannelsRepo: Repository<Channels>,
    private pusherService: PusherService,
  ) {}
  @UseGuards(JwtAuthGuard)
  async sendMessage(payload: any, sender_id: any, channel_id: any) {
    console.log(payload);
    const { message, receiver_id } = payload;
    try {
      const messageResult = await this.messageRepo.save({
        message: message,
        sender: sender_id,
        receiver: receiver_id,
        channel: channel_id,
      });
      const messageDetail = await this.messageRepo
        .createQueryBuilder('messages')
        .leftJoinAndSelect('messages.sender', 'sender')
        .leftJoinAndSelect('messages.receiver', 'receiver')
        .where('messageId=:messageId', { messageId: messageResult.messageId })
        .getOne();
      if (messageResult) {
        this.pusherService.triggerChannel(
          'messages',
          'message_data',
          messageDetail,
        );
      }
      return messageDetail;
    } catch (err) {
      console.log(err);
    }
  }

  async getMessages(senderId: number, receiverId: number) {
    try {
      const result = await this.messageRepo
        .createQueryBuilder('messages')
        .leftJoinAndSelect('messages.sender', 'sender')
        .leftJoinAndSelect('messages.receiver', 'receiver')
        .where('senderId in (:...senders)', { senders: [senderId, receiverId] })
        .andWhere('receiverId in (:...receivers)', {
          receivers: [senderId, receiverId],
        })
        .getMany();
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async getAllMessagesByChannel() {
    try {
      const result = await this.ChannelsRepo.createQueryBuilder('channel')
        .leftJoinAndSelect('channel.messages', 'messages')
        .leftJoinAndSelect('channel.user1', 'user1')
        .leftJoinAndSelect('channel.user2', 'user2')
        .getMany();
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async createChannel(userId: any) {
    const user1: any = 2;
    const result = await this.ChannelsRepo.save({
      user1: user1,
      user2: userId,
    });
    return result;
  }

  async getChannelId(user1: number, user2: number) {
    try {
      const result = await this.ChannelsRepo.createQueryBuilder('channel')
        .where('user2_id in (:...userArr1)', { userArr1: [user1, user2] })
        .andWhere('user1_id in (:...userArr2)', { userArr2: [user1, user2] })
        .getOne();
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}
