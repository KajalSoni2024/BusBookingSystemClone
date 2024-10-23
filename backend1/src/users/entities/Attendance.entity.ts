import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './users.entity';
import { BusDetail } from 'src/bus-details/entities/bus-detail.entity';
@Entity()
export class ConductorAttendance {
  @PrimaryGeneratedColumn()
  attendId: number;

  @Column({ default: false })
  isPresent: boolean;

  @Column()
  attendanceDate: Date;

  @Column()
  day: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.attendance)
  @JoinColumn({ name: 'UserId' })
  user: User;

  @ManyToOne(() => BusDetail, (busDetail) => busDetail.conductorAttendance)
  @JoinColumn({ name: 'busId' })
  busDetail: BusDetail;
}
