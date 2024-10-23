import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';
import { User } from './users.entity';
import { BusDetail } from 'src/bus-details/entities/bus-detail.entity';
@Entity()
export class ForgetPassRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otp: number;

  @ManyToOne(() => User, (user) => user.forgetPassList)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => BusDetail, (bus) => bus.conductorAttendance)
  @JoinColumn({ name: 'busId' })
  bus: BusDetail;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
