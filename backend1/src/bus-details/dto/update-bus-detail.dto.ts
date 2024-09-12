import { PartialType } from '@nestjs/mapped-types';
import { CreateBusDetailDto } from './create-bus-detail.dto';

export class UpdateBusDetailDto extends PartialType(CreateBusDetailDto) {}
