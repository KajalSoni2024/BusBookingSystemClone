import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDetailDto } from './create-ticket-detail.dto';

export class UpdateTicketDetailDto extends PartialType(CreateTicketDetailDto) {}
