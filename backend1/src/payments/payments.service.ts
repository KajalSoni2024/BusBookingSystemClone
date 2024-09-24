import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketPayment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { TicketRefund } from './entities/ticketRefund.entity';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
import { PusherService } from 'src/common/services/pusher.service';
import { HttpStatus, HttpException } from '@nestjs/common';
const stripe = require('stripe')(
  'sk_test_51PbaP8JlehMaIxjH8ih7mWf2DpABoFMv28R76jwGxh1XL8fxJeQtbDg56N2A7ycBzO7Egic5shOYNPYbfN5epBZS00AqT1ttlU',
);
@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(TicketPayment)
    private paymentRepo: Repository<TicketPayment>,
    @InjectRepository(TicketRefund)
    private ticketRefundRepo: Repository<TicketRefund>,
    private readonly pusherService: PusherService,
  ) {}

  async makePayment(paymentData: any, user: User) {
    try {
      const userId: any = user.userId;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Ticket Amount',
              },
              unit_amount: paymentData.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:8080/ticketDetails/?ticketId=${paymentData.ticketId}`,
        cancel_url: `http://localhost:8080/paymentFail/?ticketId=${paymentData.ticketId}`,
      });

      const result = await this.paymentRepo
        .createQueryBuilder()
        .insert()
        .into(TicketPayment)
        .values({
          user: userId,
          ticketDetail: paymentData.ticketId,
          amount: paymentData.price,
          sessionId: session.id,
        })
        .execute();
      return { id: session.id, result: result };
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

  async payRefund(payload: any, user: any) {
    console.log('payload ', payload);
    console.log('user', user);
    const { userId } = user;
    const { amount, ticketId } = payload;
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Refund Amount',
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:8080/ticketCancelationSuccess/?ticketId=${ticketId}`,
        cancel_url: `http://localhost:8080/paymentFail/?ticketId=${ticketId}`,
      });

      const result = await this.ticketRefundRepo
        .createQueryBuilder()
        .insert()
        .into(TicketRefund)
        .values({
          user: userId,
          ticketDetail: ticketId,
          amount: amount,
          sessionId: session.id,
        })
        .execute();

      this.pusherService.triggerChannel('refundPaid', 'refundData', true);
      return { id: session.id, result: result };
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

  async setPaymentStatusSuccess(ticketId: any) {
    try {
      const result = await this.ticketRefundRepo.find({
        relations: { ticketDetail: true, user: true },
        withDeleted: true,
      });
      console.log(result);
      return await this.ticketRefundRepo
        .createQueryBuilder()
        .update(TicketRefund)
        .set({ status: true })
        .where('ticketDetail.ticketId=:ticketId', { ticketId: ticketId })
        .execute();
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

  async getTotalTicketsCancelledToday() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Adjust for 1-based month
    const currentDateDay = currentDate.getDate();
    try {
      const result = await this.paymentRepo
        .createQueryBuilder('payments')
        .withDeleted()
        .where('deletedAt IS NOT NULL')
        .andWhere('EXTRACT(YEAR FROM deletedAt) = :currentYear', {
          currentYear,
        })
        .andWhere('EXTRACT(MONTH FROM deletedAt) = :currentMonth', {
          currentMonth,
        })
        .andWhere('EXTRACT(DAY FROM deletedAt) = :currentDate', {
          currentDate: currentDateDay,
        })
        .getCount();
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

  async getTotalTicketsCancelledPerMonth() {
    const currentYear = new Date().getFullYear();
    console.log(currentYear);
    try {
      const result = await this.paymentRepo
        .createQueryBuilder('payments')
        .withDeleted()
        .select('EXTRACT(MONTH FROM deletedAt) AS month, COUNT(*) AS count')
        .where('deletedAt is not null')
        .andWhere('EXTRACT(YEAR FROM deletedAt)=:currentYear', { currentYear })
        .groupBy('month')
        .orderBy('month')
        .printSql()
        .getRawMany();
      console.log('getTotalTicketsCancelledPerMonth:=>', result);
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

  async getTotalCancelledTicketsWithPendingRefund() {
    try {
      const cancelledTickets = await this.paymentRepo
        .createQueryBuilder('ticket')
        .withDeleted()
        .select('ticketDetail.ticketId AS ticketId')
        .leftJoin('ticket.ticketDetail', 'ticketDetail')
        .where('ticket.deletedAt is not null')
        .getRawMany();

      console.log(cancelledTickets);

      const countArr = await Promise.all(
        cancelledTickets.map(async (ticket) => {
          const checkRefundReceived = await this.ticketRefundRepo
            .createQueryBuilder('refund')
            .where('ticketId=:ticketId', { ticketId: ticket.ticketId })
            .andWhere('status=:status', { status: true })
            .getOne();
          console.log(checkRefundReceived);
          return checkRefundReceived ? 0 : 1;
        }),
      );
      const count = countArr.reduce((sum: any, count: any) => {
        return (sum += count);
      });
      console.log('count ' + count);
      return count;
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
}
