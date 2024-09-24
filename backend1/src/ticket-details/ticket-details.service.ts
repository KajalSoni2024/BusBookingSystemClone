import { Injectable } from '@nestjs/common';
import { CreateTicketDetailDto } from './dto/create-ticket-detail.dto';
import { UpdateTicketDetailDto } from './dto/update-ticket-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketDetail } from './entities/ticket-detail.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Passengers } from 'src/passenger/entities/passenger.entity';
import { TicketPayment } from 'src/payments/entities/payment.entity';
import { BusSeats } from 'src/bus-details/entities/bus-seats.entity';
import { DataSource } from 'typeorm';
import { BusDetail } from 'src/bus-details/entities/bus-detail.entity';
import { CancelTicketRequest } from './entities/cancel-ticket-req.entity';
import { BusRoute } from 'src/bus-routes/entities/bus-route.entity';
import { Cron } from '@nestjs/schedule';
import { PusherService } from 'src/common/services/pusher.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TicketDetailsService {
  constructor(
    @InjectRepository(TicketDetail)
    private ticketDetailRepo: Repository<TicketDetail>,
    @InjectRepository(Passengers)
    private PassengersRepo: Repository<Passengers>,
    @InjectRepository(TicketPayment)
    private PaymentsRepo: Repository<TicketPayment>,
    @InjectRepository(BusSeats)
    private BusSeatsRepo: Repository<BusSeats>,
    @InjectRepository(BusDetail)
    private BusDetailRepo: Repository<BusDetail>,
    @InjectRepository(CancelTicketRequest)
    private cancelTicketRequestRepo: Repository<CancelTicketRequest>,
    @InjectRepository(BusRoute)
    private BusRouteRepo: Repository<BusRoute>,
    private pusherService: PusherService,
  ) {}

  async createTicket(data: any) {
    try {
      const response = await this.ticketDetailRepo.manager.transaction(
        async (entityManager) => {
          const result = await entityManager.save(TicketDetail, data);
          return result;
        },
      );
      if (response) {
        this.pusherService.triggerChannel(
          'newTicketBooked',
          'ticketData',
          response,
        );
      }
      return response;
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

  async getPassByTicketId(ticketId: number) {
    try {
      const result = await this.ticketDetailRepo.findOne({
        where: {
          ticketId: ticketId,
        },
        relations: {
          passengers: true,
        },
      });
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

  async getBookedTicketDetails(ticketId: any) {
    try {
      const updatePaymentStatus = await this.PaymentsRepo.update(
        {
          ticketDetail: ticketId,
        },
        { status: true },
      );
      const ticketDetails = await this.ticketDetailRepo.findOne({
        where: { ticketId: ticketId },
        relations: {
          busDetail: {
            routes: true,
          },
        },
      });

      const passengerDetails = await this.PassengersRepo.createQueryBuilder(
        'passengers',
      )
        .where('passengers.ticketDetails=:ticketId', { ticketId: ticketId })
        .getMany();
      return {
        ticketDetails: ticketDetails,
        passengerDetails: passengerDetails,
      };
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

  async getAllBookedTicketsByUser(userId: any) {
    console.log(userId);
    const currentDate = new Date();
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
    try {
      const ticketPaymentDetails = await this.PaymentsRepo.createQueryBuilder(
        'payments',
      )
        .innerJoinAndSelect('payments.ticketDetail', 'ticketDetail')
        .where('payments.userId=:userId', { userId: userId })
        .andWhere('ticketDetail.ticketDate>=:currentDate', {
          currentDate: currentDate,
        })
        .andWhere('payments.status=:status', { status: true })
        .getMany();

      console.log(ticketPaymentDetails);

      const result = await Promise.all(
        ticketPaymentDetails.map(async (payment) => {
          const ticketId = payment.ticketDetail.ticketId;
          const passengerDetail = await this.ticketDetailRepo.findOne({
            relations: {
              passengers: true,
              busDetail: true,
            },
            where: { ticketId: ticketId },
          });
          return { ...payment, ticketWithPassenger: passengerDetail };
        }),
      );
      console.log(result);
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

  async cancelBookedTicket(payload: any) {
    const { ticket, otp } = payload;
    const { paymentId, ticketDetail } = ticket;
    const { ticketId } = ticketDetail;
    try {
      const isOtpSame = await this.cancelTicketRequestRepo
        .createQueryBuilder('cancelTicketRequest')
        .where('ticketId=:ticketId', { ticketId: ticketId })
        .andWhere('otp=:otp', { otp: otp })
        .getOne();
      if (isOtpSame) {
        const cancelPayment = await this.PaymentsRepo.softDelete({
          paymentId: paymentId,
        });
        console.log(ticketId);
        const ticketData = await this.ticketDetailRepo.findOne({
          where: { ticketId: ticketId },
          relations: { busDetail: true },
        });
        console.log(ticketData);
        const busId = ticketData.busDetail.busId;
        const getPassengers = await this.PassengersRepo.createQueryBuilder(
          'passengers',
        )
          .where('ticketId=:ticketId', { ticketId: ticketId })
          .getMany();

        console.log('getPassengers ', getPassengers);
        getPassengers.forEach(async (element) => {
          const delResult = await this.BusSeatsRepo.createQueryBuilder()
            .update(BusSeats)
            .set({
              passengerName: null,
              passengerAge: null,
              passengerGender: null,
              isBooked: false,
            })
            .where('seatNumber=:seatNo', { seatNo: element.seatNo })
            .andWhere('busDetail=:busId', { busId: busId })
            .execute();
          console.log('deleted', delResult);
          const incrementSeats = await this.BusDetailRepo.increment(
            { busId: busId },
            'availableSeats',
            1,
          );
          console.log('incremented', incrementSeats);
        });
        const passenger = await this.PassengersRepo.softDelete({
          ticketDetails: ticketId,
        });
        const updateCancelStatus = await this.ticketDetailRepo
          .createQueryBuilder()
          .update(TicketDetail)
          .set({ hasCancelled: true })
          .where('ticketId=:ticketId', { ticketId: ticketId })
          .execute();
        const delTicket = await this.ticketDetailRepo.softDelete({
          ticketId: ticketId,
        });

        this.pusherService.triggerChannel(
          'ticketCancelled',
          'isCancelled',
          true,
        );
        return true;
      } else {
        return false;
      }
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

  async getAllTicketsByUserId(userId: number) {
    try {
      return await this.ticketDetailRepo
        .createQueryBuilder('tickets')
        .leftJoinAndSelect('tickets.busDetail', 'busDetail')
        .select('tickets.passengers')
        .where('tickets.userId=:userId', { userId: userId })
        .getMany();
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

  async getTicketDetailsById(ticketId: number) {
    try {
      const ticketDetails = await this.ticketDetailRepo
        .createQueryBuilder('tickets')
        .leftJoinAndSelect('tickets.busDetails', 'busDetails')
        .where('tickets.ticketId=:ticketId', { ticketId: ticketId })
        .getOne();
      const passengersDetails = await this.PassengersRepo.createQueryBuilder(
        'passengers',
      )
        .where('passengers.ticketId=:ticketId', { ticketId: ticketId })
        .getMany();
      return { ...ticketDetails, passengers: passengersDetails };
    } catch (err) {
      console.log(err);
    }
  }
  async getTicketsByUserId(userId: number) {
    console.log(userId);
    try {
      return await this.ticketDetailRepo
        .createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.passengers', 'passengersDetails')
        .leftJoinAndSelect('ticket.busDetail', 'busDetail')
        .where('userId=:userId', { userId: userId })
        .getMany();
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

  async getPassengersList(payload: any) {
    const { busId, date } = payload;
    try {
      const tickets = await this.ticketDetailRepo
        .createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.passengers', 'passengers')
        .leftJoinAndSelect('ticket.busDetail', 'busDetail')
        .where('ticket.busId=:busId', { busId: busId })
        .andWhere('ticketDate=:ticketDate', { ticketDate: date })
        .getMany();

      const passengersMap = tickets.map((ticket) => {
        const newTicketPassenger = ticket.passengers.map((passenger) => {
          return {
            ...passenger,
            source: ticket.source,
            destination: ticket.destination,
            journeyDate: date,
            busId: busId,
            ticketId: ticket.ticketId,
            totalSeats: ticket.busDetail.totalSeats,
          };
        });
        return newTicketPassenger;
      });

      const passengerList = [];
      passengersMap.forEach((list) => {
        list.forEach((item) => {
          passengerList.push(item);
        });
      });

      console.log(passengerList);
      return passengerList;
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

  async generateOtpToCancelTicket(payload: any, userId: any) {
    const otp = 100000 + Math.floor(Math.random() * 900000);
    try {
      const result = await this.cancelTicketRequestRepo.save({
        ticket: payload.ticketId,
        user: userId,
        otp: otp,
      });
      if (result) {
        return otp.toString();
      } else {
        return false;
      }
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

  async getAllCanceledTickets() {
    try {
      const result = await this.ticketDetailRepo
        .createQueryBuilder('ticket')
        .withDeleted()
        .leftJoinAndSelect('ticket.user', 'user')
        .leftJoinAndSelect('ticket.busDetail', 'busDetail')
        .leftJoinAndSelect('ticket.passengers', 'passengers')
        .leftJoinAndSelect('ticket.paymentDetail', 'ticketPayments')
        .leftJoinAndSelect('ticket.refundDetail', 'refundDetail')
        .where('ticket.deletedAt is not null')
        .andWhere('hasCancelled=:isCancelled', { isCancelled: true })
        .orderBy('ticket.deletedAt', 'DESC')
        .getMany();
      const cancelledTicketsWithoutRefund = result.filter((ticket) => {
        return ticket.refundDetail == null ? true : false;
      });
      return cancelledTicketsWithoutRefund;
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

  async getTicketByTicketIdWithDeletedTrue(ticketId: any) {
    try {
      return await this.ticketDetailRepo
        .createQueryBuilder('ticket')
        .withDeleted()
        .leftJoinAndSelect('ticket.user', 'user')
        .leftJoinAndSelect('ticket.busDetail', 'busDetail')
        .leftJoinAndSelect('ticket.passengers', 'passengers')
        .leftJoinAndSelect('ticket.paymentDetail', 'ticketPayments')
        .where('ticket.ticketId=:ticketId', { ticketId: ticketId })
        .getOne();
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

  async getListOfCanceledTicketsByBusId(busId: any) {
    try {
      return await this.ticketDetailRepo
        .createQueryBuilder('ticket')
        .withDeleted()
        .leftJoinAndSelect('ticket.user', 'user')
        .leftJoinAndSelect('ticket.busDetail', 'busDetail')
        .leftJoinAndSelect('ticket.passengers', 'passengers')
        .leftJoinAndSelect('ticket.paymentDetail', 'ticketPayments')
        .leftJoinAndSelect('ticket.refundDetail', 'refundDetail')
        .where('ticket.busDetail.busId=:busId', { busId: busId })
        .andWhere('ticket.deletedAt is not null')
        .getMany();
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

  @Cron('* * * * *')
  async freeUpSeatsAfterPassengerHasTraveled() {
    const currentTime = new Date();
    currentTime.setSeconds(0);
    currentTime.setMilliseconds(0);
    const allTickets = await this.ticketDetailRepo
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.busDetail', 'busDetail')
      .leftJoinAndSelect('ticket.user', 'user')
      .leftJoinAndSelect('ticket.paymentDetail', 'paymentDetail')
      .leftJoinAndSelect('ticket.passengers', 'passengers')
      .where('hasCancelled=:isCancelled', { isCancelled: false })
      .getMany();
    const ticketsWithDepartTime = await Promise.all(
      allTickets.map(async (ticket) => {
        const busId = ticket.busDetail.busId;
        const getDepartTime = await this.BusRouteRepo.createQueryBuilder(
          'seats',
        )
          .where('busId=:busId', { busId: busId })
          .andWhere('stopName=:stopName', { stopName: ticket.destination })
          .getOne();

        return { ...ticket, departTime: getDepartTime.departTime };
      }),
    );

    ticketsWithDepartTime.forEach(async (ticket: any) => {
      const departureTime = new Date(ticket.ticketDate);
      const [hr, min, sec] = ticket.departTime.split(':');
      departureTime.setHours(parseInt(hr), parseInt(min), parseInt(sec), 0);
      console.log('currentDate:=>' + currentTime.getTime() + currentTime);
      console.log('departDate:=>' + departureTime.getTime() + departureTime);
      if (departureTime.getTime() == currentTime.getTime()) {
        console.log('yes');
        const getPassengers = await this.PassengersRepo.createQueryBuilder(
          'passengers',
        )
          .where('ticketId=:ticketId', { ticketId: ticket.ticketId })
          .getMany();

        getPassengers.forEach(async (element) => {
          const delResult = await this.BusSeatsRepo.createQueryBuilder()
            .update(BusSeats)
            .set({
              passengerName: null,
              passengerAge: null,
              passengerGender: null,
              isBooked: false,
            })
            .where('seatNumber=:seatNo', { seatNo: element.seatNo })
            .andWhere('busDetail=:busId', { busId: ticket.busDetail.busId })
            .execute();
          console.log('deleted', delResult);
          const incrementSeats = await this.BusDetailRepo.increment(
            { busId: ticket.busDetail.busId },
            'availableSeats',
            1,
          );
          console.log('incremented', incrementSeats);
        });

        const passenger = await this.PassengersRepo.softDelete({
          ticketDetails: ticket.ticketId,
        });
        const updateCancelStatus = await this.ticketDetailRepo
          .createQueryBuilder()
          .update(TicketDetail)
          .set({ hasCancelled: true })
          .where('ticketId=:ticketId', { ticketId: ticket.ticketId })
          .execute();
        const delTicket = await this.ticketDetailRepo.softDelete({
          ticketId: ticket.ticketId,
        });
      } else {
        console.log('no');
      }
    });
  }
}
