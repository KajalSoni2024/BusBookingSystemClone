import { Test, TestingModule } from '@nestjs/testing';
import { BusDetailsService } from './bus-details.service';

describe('BusDetailsService', () => {
  let service: BusDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusDetailsService],
    }).compile();

    service = module.get<BusDetailsService>(BusDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
