import { Module } from '@nestjs/common';
import { ConductorDetailsService } from './conductor-details.service';
import { ConductorDetailsController } from './conductor-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConductorDetail } from './entities/conductor-detail.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ConductorDetail])],
  controllers: [ConductorDetailsController],
  providers: [ConductorDetailsService],
})
export class ConductorDetailsModule {}
