import { User } from 'src/users/entities/users.entity';
import {
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Channels } from './channel.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  messageId: number;

  @Column()
  message: string;

  @ManyToOne(() => Channels, (channel) => channel.messages)
  @JoinColumn({ name: 'channelId' })
  channel: Channels;

  @ManyToOne(() => User, (user) => user.senderMsgs)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => User, (user) => user.receiverMsgs)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
