import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Passengers } from './entities/passenger.entity';
import { Repository } from 'typeorm';
import { BusSeats } from 'src/bus-details/entities/bus-seats.entity';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
import { BusDetail } from 'src/bus-details/entities/bus-detail.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class PassengerService {
  constructor(
    @InjectRepository(Passengers) private passengerRepo: Repository<Passengers>,
    @InjectRepository(BusSeats) private busSeatsRepo: Repository<BusSeats>,
    @InjectRepository(TicketDetail)
    private ticketDetailRepo: Repository<TicketDetail>,
    @InjectRepository(BusDetail) private busDetailRepo: Repository<BusDetail>,
  ) {}

  async addPassengers(data: any) {
    const { ticketId, passengers, seats } = data;
    const selectedSeats = seats.filter(
      (seat: any) => seat.isSelected === 'true',
    );
    try {
      const ticketDetails = await this.ticketDetailRepo.findOne({
        where: { ticketId: ticketId },
        relations: { busDetail: true },
      });
      const busId = ticketDetails.busDetail.busId;
      for (let i = 0; i < selectedSeats.length; i++) {
        const insertSeatResult = await this.busSeatsRepo.update(
          { seatId: selectedSeats[i].seatId },
          {
            passengerName: passengers[i].name,
            passengerAge: passengers[i].age,
            passengerGender: passengers[i].gender,
            isBooked: true,
          },
        );
        const insertPassengerResult = await this.passengerRepo.insert({
          seatNo: selectedSeats[i].seatNumber,
          ticketDetails: ticketId,
          passengerName: passengers[i].name,
          passengerGender: passengers[i].gender,
          passengerAge: passengers[i].age,
        });
        const decrementSeats = await this.busDetailRepo.decrement(
          { busId: busId },
          'availableSeats',
          1,
        );
      }
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async updateSeatNo(passengerId: number, seatNo: number) {
    try {
      const response = await this.passengerRepo.manager.transaction(
        async (entityManager) => {
          return await entityManager.update(
            Passengers,
            { passengerId: passengerId },
            { seatNo: seatNo },
          );
        },
      );
      return response;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async updatePassengersTraveledStatus(query: any) {
    const { passengerId, hasTraveled } = query;
    let isTraveled: boolean = false;
    if (hasTraveled == 'true') {
      isTraveled = true;
    }
    try {
      const result = await this.passengerRepo
        .createQueryBuilder()
        .update(Passengers)
        .set({ hasTraveled: isTraveled })
        .where('passengerId=:passengerId', { passengerId: passengerId })
        .execute();
      return result;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async getTotalPassengersTraveledToday() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    console.log('current date:=>' + currentDate);
    try {
      const totalPassengers = await this.passengerRepo
        .createQueryBuilder('passengers')
        .withDeleted()
        .leftJoinAndSelect('passengers.ticketDetails', 'ticketDetails')
        .where('ticketDetails.ticketDate=:currentDate', {
          currentDate: currentDate,
        })
        .getCount();
      return totalPassengers;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async getPassengersTraveledPerMonth() {
    const currentYear = new Date().getFullYear();
    try {
      const result = await this.passengerRepo
        .createQueryBuilder('passengers')
        .withDeleted()
        .select(
          'EXTRACT(MONTH FROM ticketDetails.ticketDate) AS month, COUNT(*) AS count',
        )
        .leftJoin('passengers.ticketDetails', 'ticketDetails')
        .where('EXTRACT(YEAR FROM ticketDetails.ticketDate) = :currentYear', {
          currentYear,
        })
        .groupBy('month')
        .getRawMany();
      console.log(result);
      return result;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }
}
