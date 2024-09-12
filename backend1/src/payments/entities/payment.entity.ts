import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { TicketDetail } from '../../ticket-details/entities/ticket-detail.entity';
import { User } from 'src/users/entities/users.entity';
@Entity()
export class TicketPayment {
  @PrimaryGeneratedColumn()
  paymentId: number;

  @Column()
  sessionId: string;

  @Column()
  amount: number;

  @OneToOne(() => TicketDetail, (ticket) => ticket.paymentDetail)
  @JoinColumn({ name: 'ticketId' })
  ticketDetail: TicketDetail;

  @Column({ default: false })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userId' })
  user: User;
}
