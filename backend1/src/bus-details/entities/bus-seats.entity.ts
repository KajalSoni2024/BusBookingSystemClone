import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BusDetail } from './bus-detail.entity';

@Entity()
export class BusSeats {
  @PrimaryGeneratedColumn()
  seatId: number;

  @Column()
  seatNumber: number;

  @Column({ default: null })
  passengerName: string;

  @Column({ default: null })
  passengerGender: string;

  @Column({ default: null })
  passengerAge: number;

  @Column({ default: false, type: 'boolean' })
  isBooked: boolean;

  @ManyToOne(() => BusDetail, (busDetail) => busDetail.seatList)
  @JoinColumn({ name: 'busId' })
  busDetail: BusDetail;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
