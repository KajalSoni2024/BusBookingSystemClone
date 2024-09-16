import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { TicketDetail } from './ticket-detail.entity';
import { User } from 'src/users/entities/users.entity';
@Entity()
export class CancelTicketRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otp: number;

  @ManyToOne(
    () => TicketDetail,
    (ticketDetail) => ticketDetail.cancelTicketRequest,
  )
  @JoinColumn({ name: 'ticketId' })
  ticket: TicketDetail;

  @ManyToOne(() => User, (user) => user.cancelTicketRequests)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
