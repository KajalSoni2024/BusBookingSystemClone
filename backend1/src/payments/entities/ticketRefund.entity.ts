import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
import { User } from 'src/users/entities/users.entity';
@Entity()
export class TicketRefund {
  @PrimaryGeneratedColumn()
  refundId: number;

  @Column()
  sessionId: string;

  @Column()
  amount: number;

  @Column({ default: false })
  status: boolean;

  @OneToOne(() => TicketDetail, (ticketDetail) => ticketDetail.refundDetail)
  @JoinColumn({ name: 'ticketId' })
  ticketDetail: TicketDetail;

  @ManyToOne(() => User, (user) => user.refundDetails)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
