import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateConductorDetailDto } from './dto/create-conductor-detail.dto';
import { UpdateConductorDetailDto } from './dto/update-conductor-detail.dto';
import { Repository } from 'typeorm';
import { ConductorDetail } from './entities/conductor-detail.entity';
@Injectable()
export class ConductorDetailsService {
  constructor(
    @InjectRepository(ConductorDetail)
    private busConductorRepo: Repository<ConductorDetail>,
  ) {}
  async create(createConductorDetailDto: any) {
    try {
      const busId = createConductorDetailDto.busId;
      const response = await this.busConductorRepo.manager.transaction(
        async (entityManager) => {
          return await entityManager.save(ConductorDetail, [
            { ...createConductorDetailDto.details[0], bus: busId },
            { ...createConductorDetailDto.details[1], bus: busId },
          ]);
        },
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}
