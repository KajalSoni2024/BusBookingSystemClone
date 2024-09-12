import { Injectable } from '@nestjs/common';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(TicketDetail)
    private ticketDetailRepo: Repository<TicketDetail>,
  ) {}

  async registerUser(userData: any) {
    const password = userData.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    userData.password = hash;
    const response = await this.usersRepository.manager.transaction(
      async (EntityManager) => {
        return await EntityManager.save(User, userData);
      },
    );
    return response;
  }

  async findByColumn(payload: any): Promise<any> {
    return await this.usersRepository.findOneBy(payload);
  }

  async getUserById(userId: number) {
    return await this.usersRepository.findOneBy({ userId: userId });
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email: email });
  }

  async resetPass(payload: any) {
    const { password, userId } = payload;
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    return await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ password: hashPass })
      .where('userId=:userId', { userId: userId })
      .execute();
  }

  async getAllUsers() {
    return await this.usersRepository.find({
      where: { role: 0 },
      relations: { tickets: true, payments: true },
    });
  }

  async getListOfConductors() {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where({ role: 2 })
      .andWhere({ isAssigned: false })
      .getMany();
  }

  async getListOfDrivers() {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where({ role: 3 })
      .andWhere({ isAssigned: false })
      .getMany();
  }
}
