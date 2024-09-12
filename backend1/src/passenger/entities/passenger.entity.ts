import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { TicketDetail } from '../../ticket-details/entities/ticket-detail.entity';
@Entity()
export class Passengers {
  @PrimaryGeneratedColumn()
  passengerId: number;

  @Column()
  passengerName: string;

  @Column()
  passengerAge: string;

  @Column()
  passengerGender: string;

  @Column({ nullable: true })
  seatNo: number;

  @Column({ default: false })
  hasTraveled: boolean;

  @ManyToOne(() => TicketDetail, (ticket) => ticket.passengers)
  @JoinColumn({ name: 'ticketId' })
  ticketDetails: TicketDetail;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
