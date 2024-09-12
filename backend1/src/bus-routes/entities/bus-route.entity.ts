import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BusDetail } from '../../bus-details/entities/bus-detail.entity';

@Entity()
export class BusRoute {
  @PrimaryGeneratedColumn()
  routeId: number;

  @Column()
  stopNo: number;

  @Column()
  stopName: string;

  @Column({ type: 'time' })
  arrivalTime: string;

  @Column({ type: 'time' })
  departTime: string;

  @ManyToOne(() => BusDetail, (busDetails) => busDetails.routes)
  @JoinColumn({ name: 'busId' })
  busId: BusDetail;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
