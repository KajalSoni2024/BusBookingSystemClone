import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailerDto } from './create-emailer.dto';

export class UpdateEmailerDto extends PartialType(CreateEmailerDto) {}
