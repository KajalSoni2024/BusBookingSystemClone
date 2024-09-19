import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StateAndCitiesService } from './state-and-cities.service';
import { CreateStateAndCityDto } from './dto/create-state-and-city.dto';
import { UpdateStateAndCityDto } from './dto/update-state-and-city.dto';

@Controller('state-and-cities')
export class StateAndCitiesController {
  constructor(private readonly stateAndCitiesService: StateAndCitiesService) {}

  @Post()
  create(@Body() createStateAndCityDto: CreateStateAndCityDto) {
    return this.stateAndCitiesService.create(createStateAndCityDto);
  }

  @Get()
  findAll() {
    return this.stateAndCitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stateAndCitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStateAndCityDto: UpdateStateAndCityDto) {
    return this.stateAndCitiesService.update(+id, updateStateAndCityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stateAndCitiesService.remove(+id);
  }
}
