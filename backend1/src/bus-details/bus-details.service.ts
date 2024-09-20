import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBusDetailDto } from './dto/create-bus-detail.dto';
import { UpdateBusDetailDto } from './dto/update-bus-detail.dto';
import { BusDetail } from './entities/bus-detail.entity';
import { Repository, IsNull, Not } from 'typeorm';
import { BusSeats } from './entities/bus-seats.entity';
import { ConductorDetail } from 'src/conductor-details/entities/conductor-detail.entity';
import { BusRoute } from 'src/bus-routes/entities/bus-route.entity';
import { identity } from 'rxjs';

@Injectable()
export class BusDetailsService {
  constructor(
    @InjectRepository(BusDetail)
    private busDetailRepo: Repository<BusDetail>,
    @InjectRepository(BusSeats)
    private busSeatsRepo: Repository<BusSeats>,
    @InjectRepository(ConductorDetail)
    private conductorDetailRepo: Repository<ConductorDetail>,
    @InjectRepository(BusRoute)
    private busRouteRepo: Repository<BusRoute>,
  ) {}
  async create(createBusDetailDto: any) {
    try {
      const busDetail = await this.busDetailRepo.save({
        availableSeats: createBusDetailDto.totalSeats,
        ...createBusDetailDto,
      });
      const totalSeats = createBusDetailDto.totalSeats;

      for (let i = 0; i < totalSeats; i++) {
        await this.busSeatsRepo.save({
          seatNumber: i + 1,
          busDetail: busDetail.busId,
        });
      }

      return busDetail;
    } catch (error) {
      console.log(error);
    }
  }

  async getBusesByRoute(query: any) {
    try {
      const result = await this.busDetailRepo
        .createQueryBuilder('busDetail')
        .innerJoinAndSelect('busDetail.routes', 'busId')
        .orderBy('busId.stopNo', 'ASC')
        .getMany();

      const busDetails = result.filter((element) => {
        let count = 0;
        let stopOrder = 0;

        element.routes.forEach((route) => {
          if (count == 0) {
            if (route.stopName == query.source) {
              count++;
              stopOrder = route.stopNo;
            }
          }
          if (count == 1) {
            if (route.stopName == query.dest) {
              if (stopOrder < route.stopNo) {
                count++;
                stopOrder;
              }
            }
          }
        });
        if (count == 2) {
          return true;
        } else {
          return false;
        }
      });
      return busDetails;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async getAvailSeats(busId: number) {
    try {
      return await this.busDetailRepo
        .createQueryBuilder()
        .select('busDetail.availableSeats')
        .from(BusDetail, 'busDetail')
        .where('busDetail.busId=:busId', { busId: busId })
        .getOne();
    } catch (err) {
      console.log(err);
    }
  }

  async getTotalSeats(busId: number) {
    try {
      return await this.busDetailRepo
        .createQueryBuilder()
        .select('busDetail.totalSeats')
        .from(BusDetail, 'busDetail')
        .where('busDetail.busId=:busId', { busId: busId })
        .getOne();
    } catch (err) {
      console.log(err);
    }
  }

  async decrementSeat(busId: number) {
    try {
      return await this.busDetailRepo.decrement(
        { busId: busId },
        'availableSeats',
        1,
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getBusesWithoutConductors() {
    try {
      const result = await this.busDetailRepo.find({
        relations: {},
        where: { conductor: IsNull(), driver: IsNull() },
      });
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async getBusSeatsByBusId(busId: number) {
    try {
      const result = await this.busSeatsRepo
        .createQueryBuilder('seats')
        .where('seats.busDetail=:busId', { busId: busId })
        .getMany();
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async getAllBuses() {
    try {
      const result = await this.busDetailRepo.find({
        relations: {
          tickets: true,
          conductor: true,
          driver: true,
          routes: true,
        },
        where: { conductor: Not(IsNull()), driver: Not(IsNull()) },
      });
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async getBusDetailsById(busId: number) {
    try {
      const result = await this.busDetailRepo.findOne({
        where: { busId: busId },
        relations: {
          routes: true,
          conductor: true,
          driver: true,
        },
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async updateBusDetails(updatedDetails: any) {
    const { busId } = updatedDetails;
    try {
      const busDetails = await this.busDetailRepo.findOne({
        where: { busId: busId },
        relations: {
          routes: true,
        },
      });
      const updatedTotalSeats = updatedDetails.totalSeats;
      const { totalSeats } = busDetails;
      const updateResult = await this.busDetailRepo.update(
        { busId: busId },
        {
          busName: updatedDetails.busName,
          busNo: updatedDetails.busNo,
          totalSeats: updatedDetails.totalSeats,
          availableSeats:
            busDetails.availableSeats + (updatedTotalSeats - totalSeats),
          price: updatedDetails.price,
        },
      );
      console.log(updateResult);
      if (updatedTotalSeats > totalSeats) {
        for (let i = 0; i < updatedTotalSeats - totalSeats; i++) {
          for (let i = 0; i < totalSeats; i++) {
            this.busSeatsRepo.save({
              seatNumber: totalSeats + i + 1,
              busDetail: busId,
            });
          }
        }
      }
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  async updateBusConductorDetails(payload: any) {
    const { driverId, conductorId, busId } = payload;
    try {
      return await this.busDetailRepo
        .createQueryBuilder()
        .update(BusDetail)
        .set({ conductor: conductorId, driver: driverId })
        .where('busId=:busId', { busId: busId })
        .execute();
    } catch (err) {
      console.log(err);
    }
  }

  async updateBusRouteDetails(payload: any) {
    const { busId } = payload;
    console.log(payload);
    try {
      const busDetails = await this.busDetailRepo.findOne({
        where: { busId: busId },
        relations: {
          routes: true,
        },
      });
      console.log(busDetails);
      const updatedRoutes = payload.routes;
      const { routes } = busDetails;
      for (let i = 0; i < routes.length; i++) {
        const result = await this.busRouteRepo
          .createQueryBuilder()
          .update(BusRoute)
          .set({
            stopName: updatedRoutes[i].stopName,
            arrivalTime: updatedRoutes[i].arrivalTime,
            departTime: updatedRoutes[i].departTime,
          })
          .where('busId=:busId', { busId: busId })
          .andWhere('routeId=:routeId', { routeId: updatedRoutes[i].routeId })
          .execute();
      }
      if (updatedRoutes.length > routes.length) {
        for (let i = routes.length; i < updatedRoutes.length; i++) {
          const result = await this.busRouteRepo.save({
            busId: busId,
            stopName: updatedRoutes[i].stopName,
            stopNo: updatedRoutes[i].stopNo,
            arrivalTime: updatedRoutes[i].arrivalTime,
            departTime: updatedRoutes[i].departTime,
          });
        }
      }
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  async addConductorDetails(payload: any) {
    try {
      const result = await this.busDetailRepo
        .createQueryBuilder()
        .update(BusDetail)
        .set({ conductor: payload.conductorId, driver: payload.driverId })
        .where('busId=:busId', { busId: payload.busId })
        .execute();
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async getAssignedBusesById(userId: any) {
    try {
      const result = await this.busDetailRepo
        .createQueryBuilder('bus')
        .leftJoinAndSelect('bus.routes', 'routes')
        .leftJoinAndSelect('bus.conductor', 'user1')
        .leftJoinAndSelect('bus.driver', 'user2')
        .where('conductorId=:conductorId', { conductorId: userId })
        .orWhere('driverId=:driverId', { driverId: userId })
        .getMany();
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async getBusDetailByBusName(query: any) {
    const { busName, busNo } = query;
    try {
      return await this.busDetailRepo
        .createQueryBuilder('busDetail')
        .where('busName=:busName', { busName: busName })
        .andWhere('busNo=:busNo', { busNo: busNo })
        .getOne();
    } catch (err) {
      console.log(err);
    }
  }
  async getTotalBuses() {
    try {
      return await this.busDetailRepo.createQueryBuilder().getCount();
    } catch (err) {
      throw err;
    }
  }
}
