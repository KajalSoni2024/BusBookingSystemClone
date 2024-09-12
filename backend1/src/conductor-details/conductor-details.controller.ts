import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConductorDetailsService } from './conductor-details.service';
import { UpdateConductorDetailDto } from './dto/update-conductor-detail.dto';

@Controller()
export class ConductorDetailsController {
  constructor(
    private readonly conductorDetailService: ConductorDetailsService,
  ) {}
}
