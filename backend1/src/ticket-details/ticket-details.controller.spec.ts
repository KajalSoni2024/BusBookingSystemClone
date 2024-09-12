import { Test, TestingModule } from '@nestjs/testing';
import { TicketDetailsController } from './ticket-details.controller';
import { TicketDetailsService } from './ticket-details.service';

describe('TicketDetailsController', () => {
  let controller: TicketDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketDetailsController],
      providers: [TicketDetailsService],
    }).compile();

    controller = module.get<TicketDetailsController>(TicketDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
