import { Test, TestingModule } from '@nestjs/testing';
import { ConductorDetailsService } from './conductor-details.service';

describe('ConductorDetailsService', () => {
  let service: ConductorDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConductorDetailsService],
    }).compile();

    service = module.get<ConductorDetailsService>(ConductorDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
