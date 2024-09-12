import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BusDetail } from '../../bus-details/entities/bus-detail.entity';
@Entity()
export class ConductorDetail {
  @PrimaryGeneratedColumn()
  conductor_id: number;

  @Column()
  cond_name: string;

  @Column()
  cond_gender: string;

  @Column()
  cond_contact: number;

  @Column()
  cond_age: number;

  @Column()
  cond_role: boolean;

  @ManyToOne(() => BusDetail, (busDetails) => busDetails.conductors)
  bus: BusDetail;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
