import { Test, TestingModule } from '@nestjs/testing';
import { ConductorDetailsController } from './conductor-details.controller';
import { ConductorDetailsService } from './conductor-details.service';

describe('ConductorDetailsController', () => {
  let controller: ConductorDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConductorDetailsController],
      providers: [ConductorDetailsService],
    }).compile();

    controller = module.get<ConductorDetailsController>(ConductorDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
