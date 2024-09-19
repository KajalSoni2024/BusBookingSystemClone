import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCommonDto } from './dto/create-common.dto';
import { UpdateCommonDto } from './dto/update-common.dto';
import { PusherService } from './services/pusher.service';

@Controller('common')
export class CommonController {
  constructor(private readonly pusherService: PusherService) {}
}
