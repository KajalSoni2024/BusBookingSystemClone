import { Test, TestingModule } from '@nestjs/testing';
import { StateAndCitiesService } from './state-and-cities.service';

describe('StateAndCitiesService', () => {
  let service: StateAndCitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StateAndCitiesService],
    }).compile();

    service = module.get<StateAndCitiesService>(StateAndCitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
