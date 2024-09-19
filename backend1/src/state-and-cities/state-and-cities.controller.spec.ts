import { Test, TestingModule } from '@nestjs/testing';
import { StateAndCitiesController } from './state-and-cities.controller';
import { StateAndCitiesService } from './state-and-cities.service';

describe('StateAndCitiesController', () => {
  let controller: StateAndCitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateAndCitiesController],
      providers: [StateAndCitiesService],
    }).compile();

    controller = module.get<StateAndCitiesController>(StateAndCitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
