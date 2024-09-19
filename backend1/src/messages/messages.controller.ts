import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/sendMessage')
  async sendMessage(@Request() request: any, @Body() payload: any) {
    const user = request.user;
    console.log(user);
    const senderId = user.userId;
    try {
      const channel = await this.messagesService.getChannelId(
        user.userId,
        payload.receiver_id,
      );
      return await this.messagesService.sendMessage(
        payload,
        senderId,
        channel.channel_id,
      );
    } catch (err) {
      console.log(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getMessages')
  async getMessages(
    @Request() request: any,
    @Query('receiverId') receiverId: any,
  ) {
    try {
      const user = request.user;
      const senderId = user.userId;
      console.log('senderId:=>', senderId);
      return await this.messagesService.getMessages(senderId, receiverId);
    } catch (err) {
      console.log(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAllMessagesByChannel')
  async getAllMessagesByChannel() {
    try {
      return await this.messagesService.getAllMessagesByChannel();
    } catch (err) {
      console.log(err);
    }
  }
}
