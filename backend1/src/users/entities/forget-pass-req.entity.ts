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
@Entity()
export class ForgetPassRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otp: number;

  @ManyToOne(() => User, (user) => user.forgetPassList)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
