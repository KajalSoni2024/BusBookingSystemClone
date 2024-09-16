import { Injectable } from '@nestjs/common';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
import { ForgetPassRequest } from './entities/forget-pass-req.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(TicketDetail)
    private ticketDetailRepo: Repository<TicketDetail>,
    @InjectRepository(ForgetPassRequest)
    private forgetPassRequestRepo: Repository<ForgetPassRequest>,
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
    try {
      return await this.usersRepository.findOneBy(payload);
    } catch (err) {
      console.log(err);
    }
  }

  async getUserById(userId: number) {
    try {
      return await this.usersRepository.findOneBy({ userId: userId });
    } catch (err) {
      console.log(err);
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.usersRepository.findOneBy({ email: email });
    } catch (err) {
      console.log(err);
    }
  }

  async resetPass(payload: any) {
    const { password, userId } = payload;
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    try {
      return await this.usersRepository
        .createQueryBuilder()
        .update(User)
        .set({ password: hashPass })
        .where('userId=:userId', { userId: userId })
        .execute();
    } catch (err) {
      console.log(err);
    }
  }

  async getAllUsers() {
    try {
      return await this.usersRepository.find({
        where: { role: 0 },
        relations: { tickets: true, payments: true },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getListOfConductors() {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .where({ role: 2 })
        .andWhere({ isAssigned: false })
        .getMany();
    } catch (err) {
      console.log(err);
    }
  }

  async getListOfDrivers() {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .where({ role: 3 })
        .andWhere({ isAssigned: false })
        .getMany();
    } catch (err) {
      console.log(err);
    }
  }

  async getOtpForForgetPassRequest(email: string) {
    const user = await this.usersRepository.findOneBy({ email: email });
    if (!user) {
      return false;
    } else {
      const userId: any = user.userId;
      const otp = 100000 + Math.floor(Math.random() * 900000);
      const result = await this.forgetPassRequestRepo
        .createQueryBuilder()
        .insert()
        .into(ForgetPassRequest)
        .values({ user: userId, otp: otp })
        .execute();
      return otp.toString();
    }
  }

  async checkForgetPassOtp(query: any) {
    const { userId, otp } = query;
    try {
      console.log(userId);
      const result = await this.forgetPassRequestRepo
        .createQueryBuilder('forgetPasswordOtp')
        .where('otp=:otp', { otp: otp })
        .andWhere('userId=:userId', { userId: userId })
        .getMany();

      if (!result) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
