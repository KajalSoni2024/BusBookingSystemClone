import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ConductorDetail } from '../../conductor-details/entities/conductor-detail.entity';
import { BusRoute } from '../../bus-routes/entities/bus-route.entity';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
import { BusSeats } from './bus-seats.entity';
import { User } from '../../users/entities/users.entity';
@Entity()
export class BusDetail {
  @PrimaryGeneratedColumn()
  busId: number;

  @Column()
  busName: string;

  @Column()
  busNo: string;

  @Column()
  totalSeats: number;

  @Column()
  availableSeats: number;

  @Column()
  price: number;

  @OneToOne(
    () => User,
    (user) => {
      user.busAssignedToConductor;
    },
  )
  @JoinColumn({ name: 'conductorId' })
  conductor: User;

  @OneToOne(() => User, (user) => user.busAssignedToDriver)
  @JoinColumn({ name: 'DriverId' })
  driver: User;

  @OneToMany(() => TicketDetail, (ticket) => ticket.busDetail)
  tickets: TicketDetail[];

  @OneToMany(() => ConductorDetail, (conductorDetails) => conductorDetails.bus)
  conductors: ConductorDetail[];

  @OneToMany(() => BusRoute, (busRoute) => busRoute.busId)
  routes: BusRoute[];

  @OneToMany(() => BusSeats, (busSeats) => busSeats.busDetail)
  seatList: BusSeats[];
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
