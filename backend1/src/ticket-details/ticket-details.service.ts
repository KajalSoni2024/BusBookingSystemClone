import { Injectable } from '@nestjs/common';
import { CreateTicketDetailDto } from './dto/create-ticket-detail.dto';
import { UpdateTicketDetailDto } from './dto/update-ticket-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketDetail } from './entities/ticket-detail.entity';
import { Repository } from 'typeorm';
import { Passengers } from 'src/passenger/entities/passenger.entity';
import { TicketPayment } from 'src/payments/entities/payment.entity';
import { BusSeats } from 'src/bus-details/entities/bus-seats.entity';
import { DataSource } from 'typeorm';
import { BusDetail } from 'src/bus-details/entities/bus-detail.entity';
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
  ) {}

  async createTicket(data: any) {
    const resposne = await this.ticketDetailRepo.manager.transaction(
      async (entityManager) => {
        const result = await entityManager.save(TicketDetail, data);
        return result;
      },
    );
  }

  async getPassByTicketId(ticketId: number) {
    const result = await this.ticketDetailRepo.findOne({
      where: {
        ticketId: ticketId,
      },
      relations: {
        passengers: true,
      },
    });
    return result;
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
        relations: { busDetail: true },
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
    }
  }

  async getAllBookedTicketsByUser() {
    const userId = 1;
    const ticketPaymentDetails = await this.PaymentsRepo.createQueryBuilder(
      'payments',
    )
      .innerJoinAndSelect('payments.ticketDetail', 'ticketDetail')
      .where('payments.user=:userId', { userId: userId })
      .andWhere('ticketDetail.ticketDate>:currentDate', {
        currentDate: new Date(),
      })
      .andWhere('payments.status=:status', { status: true })
      .getMany();

    const result = Promise.all(
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
  }

  async cancelBookedTicket(payload: any) {
    const { paymentId, ticketDetail } = payload;
    const { ticketId } = ticketDetail;
    try {
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
      const delTicket = await this.ticketDetailRepo.softDelete({
        ticketId: ticketId,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getAllTicketsByUserId(userId: number) {
    return await this.ticketDetailRepo
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.busDetail', 'busDetail')
      .select('tickets.passengers')
      .where('tickets.userId=:userId', { userId: userId })
      .getMany();
  }

  async getTicketDetailsById(ticketId: number) {
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
    }
  }
}
