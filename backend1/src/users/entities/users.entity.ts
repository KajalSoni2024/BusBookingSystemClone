import { BusDetail } from 'src/bus-details/entities/bus-detail.entity';
import { TicketPayment } from 'src/payments/entities/payment.entity';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
import { ForgetPassRequest } from './forget-pass-req.entity';
import { CancelTicketRequest } from 'src/ticket-details/entities/cancel-ticket-req.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { TicketRefund } from 'src/payments/entities/ticketRefund.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Channels } from 'src/messages/entities/channel.entity';
import { ConductorAttendance } from './Attendance.entity';
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
  contact: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAssigned: boolean;

  @Column({ default: null })
  image: string;

  @OneToOne(() => BusDetail, (bus) => bus.conductor)
  busAssignedToConductor: BusDetail;

  @OneToOne(() => BusDetail, (bus) => bus.driver)
  busAssignedToDriver: BusDetail;

  @OneToMany(() => TicketRefund, (ticketRefund) => ticketRefund.user)
  refundDetails: TicketRefund[];

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

  @OneToMany(() => ForgetPassRequest, (forgetPass) => forgetPass.user)
  forgetPassList: ForgetPassRequest[];

  @OneToMany(() => Message, (message) => message.sender)
  senderMsgs: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receiverMsgs: Message[];

  @OneToMany(
    () => CancelTicketRequest,
    (cancelTicketRequest) => cancelTicketRequest.user,
  )
  cancelTicketRequests: CancelTicketRequest[];

  @OneToMany(() => Channels, (channel) => channel.user1)
  adminChannels: Channels[];

  @OneToOne(() => Channels, (channel) => channel.user2)
  userChannel: Channels;

  @OneToMany(() => ConductorAttendance, (attendance) => attendance.user)
  attendance: ConductorAttendance[];
}
