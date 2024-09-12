import { PartialType } from '@nestjs/mapped-types';
import { CreateConductorDetailDto } from './create-conductor-detail.dto';

export class UpdateConductorDetailDto extends PartialType(CreateConductorDetailDto) {}
