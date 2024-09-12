import { Test, TestingModule } from '@nestjs/testing';
import { TicketDetailsService } from './ticket-details.service';

describe('TicketDetailsService', () => {
  let service: TicketDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketDetailsService],
    }).compile();

    service = module.get<TicketDetailsService>(TicketDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
