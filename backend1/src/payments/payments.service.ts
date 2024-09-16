import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketPayment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';

const stripe = require('stripe')(
  'sk_test_51PbaP8JlehMaIxjH8ih7mWf2DpABoFMv28R76jwGxh1XL8fxJeQtbDg56N2A7ycBzO7Egic5shOYNPYbfN5epBZS00AqT1ttlU',
);
@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(TicketPayment)
    private paymentRepo: Repository<TicketPayment>,
  ) {}

  async makePayment(paymentData: any, user: User) {
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
  }
}
