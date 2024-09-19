import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/users/entities/users.entity';
import { JoinAttribute } from 'typeorm/query-builder/JoinAttribute';
@Entity()
export class Channels {
  @PrimaryGeneratedColumn()
  channel_id: number;

  @ManyToOne(() => User, (user) => user.adminChannels)
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @OneToOne(() => User, (user) => user.userChannel)
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
