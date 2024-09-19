import { Injectable } from '@nestjs/common';
import { CreateStateAndCityDto } from './dto/create-state-and-city.dto';
import { UpdateStateAndCityDto } from './dto/update-state-and-city.dto';

@Injectable()
export class StateAndCitiesService {
  create(createStateAndCityDto: CreateStateAndCityDto) {
    return 'This action adds a new stateAndCity';
  }

  findAll() {
    return `This action returns all stateAndCities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stateAndCity`;
  }

  update(id: number, updateStateAndCityDto: UpdateStateAndCityDto) {
    return `This action updates a #${id} stateAndCity`;
  }

  remove(id: number) {
    return `This action removes a #${id} stateAndCity`;
  }
}
