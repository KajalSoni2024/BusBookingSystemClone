import { Module } from '@nestjs/common';
import { StateAndCitiesService } from './state-and-cities.service';
import { StateAndCitiesController } from './state-and-cities.controller';

@Module({
  controllers: [StateAndCitiesController],
  providers: [StateAndCitiesService],
})
export class StateAndCitiesModule {}
