import { BusDetail } from 'src/bus-details/entities/bus-detail.entity';
import { TicketPayment } from 'src/payments/entities/payment.entity';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  gender: string;

  @Column()
  contact: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAssigned: boolean;

  @OneToOne(() => BusDetail, (bus) => bus.conductor)
  busAssignedToConductor: BusDetail;

  @OneToOne(() => BusDetail, (bus) => bus.driver)
  busAssignedToDriver: BusDetail;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @Column({ type: 'integer', default: 0 })
  role: number;
  @OneToMany(() => TicketDetail, (ticket) => ticket.user)
  tickets: TicketDetail[];

  @OneToMany(() => TicketPayment, (payment) => payment.user)
  payments: TicketPayment[];
}