import { PartialType } from '@nestjs/mapped-types';
import { CreateStateAndCityDto } from './create-state-and-city.dto';

export class UpdateStateAndCityDto extends PartialType(CreateStateAndCityDto) {}
