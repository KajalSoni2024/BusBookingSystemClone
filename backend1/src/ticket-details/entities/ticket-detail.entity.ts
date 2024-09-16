import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BusDetail } from '../../bus-details/entities/bus-detail.entity';
import { Passengers } from '../../passenger/entities/passenger.entity';
import { TicketPayment } from '../../payments/entities/payment.entity';
import { User } from 'src/users/entities/users.entity';
import { CancelTicketRequest } from './cancel-ticket-req.entity';
@Entity()
export class TicketDetail {
  @PrimaryGeneratedColumn()
  ticketId: number;

  @Column()
  ticketDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  bookedAt: Date;

  @Column()
  source: string;

  @Column()
  destination: string;

  @OneToMany(
    () => CancelTicketRequest,
    (cancelTicketReq) => cancelTicketReq.ticket,
  )
  cancelTicketRequest: CancelTicketRequest[];

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => BusDetail, (busDetail) => busDetail.tickets)
  @JoinColumn({ name: 'busId' })
  busDetail: BusDetail;

  @OneToMany(() => Passengers, (passenger) => passenger.ticketDetails)
  passengers: Passengers[];

  @OneToOne(() => TicketPayment, (payment) => payment.ticketDetail)
  paymentDetail: TicketPayment;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
