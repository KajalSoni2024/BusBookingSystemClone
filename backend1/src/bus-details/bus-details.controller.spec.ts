import { Test, TestingModule } from '@nestjs/testing';
import { BusDetailsController } from './bus-details.controller';
import { BusDetailsService } from './bus-details.service';

describe('BusDetailsController', () => {
  let controller: BusDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusDetailsController],
      providers: [BusDetailsService],
    }).compile();

    controller = module.get<BusDetailsController>(BusDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
