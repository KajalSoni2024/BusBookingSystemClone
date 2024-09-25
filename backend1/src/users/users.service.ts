import { Injectable } from '@nestjs/common';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { TicketDetail } from 'src/ticket-details/entities/ticket-detail.entity';
import { ForgetPassRequest } from './entities/forget-pass-req.entity';
import { PusherService } from 'src/common/services/pusher.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(TicketDetail)
    private ticketDetailRepo: Repository<TicketDetail>,
    @InjectRepository(ForgetPassRequest)
    private forgetPassRequestRepo: Repository<ForgetPassRequest>,
    private pusherService: PusherService,
  ) {}

  async registerUser(userData: any) {
    const password = userData.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    userData.password = hash;
    try {
      const response = await this.usersRepository.manager.transaction(
        async (EntityManager) => {
          return await EntityManager.save(User, userData);
        },
      );
      if (response) {
        this.pusherService.triggerChannel(
          'newUserRegistered',
          'userData',
          response,
        );
      }
      return response;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async findByColumn(payload: any): Promise<any> {
    try {
      return await this.usersRepository.findOneBy(payload);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async getUserById(userId: number) {
    try {
      return await this.usersRepository.findOneBy({ userId: userId });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.usersRepository.findOneBy({ email: email });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async getOtpForForgetPassRequest(email: string) {
    try {
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
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
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
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async setIsAssignedToTrue(conductorId: any, driverId: any) {
    try {
      return await this.usersRepository
        .createQueryBuilder()
        .update(User)
        .set({ isAssigned: true })
        .whereInIds([conductorId, driverId])
        .execute();
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async getTotalUsers() {
    try {
      return await this.usersRepository.createQueryBuilder('users').getCount();
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }
  async getUsersRegisteredPerMonth() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    console.log(currentYear);
    try {
      const users = await this.usersRepository
        .createQueryBuilder('users')
        .select(
          'EXTRACT(MONTH FROM createdAt) AS month, COUNT(*) AS totalUsers',
        )
        .where('EXTRACT(YEAR FROM createdAt) = :currentYear', { currentYear })
        .groupBy('month')
        .orderBy('month')
        .getRawMany();
      console.log(users);
      return users;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }
  async getRecentlyRegisteredUser() {
    const currentDate = new Date();
    const monthDiff = 2;
    try {
      const users = await this.usersRepository
        .createQueryBuilder('users')
        .select([
          'firstName',
          'lastName',
          'gender',
          'contact',
          'email',
          'createdAt',
          'userId',
        ])
        .addSelect(
          `(${currentDate.getMonth() + 1} - EXTRACT(MONTH FROM createdAt)) AS monthDiff`,
        )
        .where('EXTRACT(YEAR FROM createdAt)=:currentYear', {
          currentYear: currentDate.getFullYear(),
        })
        .andWhere('role=:role', { role: 0 })
        .having('monthDiff<=:monthDiff', { monthDiff })
        .printSql()
        .getRawMany();
      console.log(users);
      return users;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async getLoggedInUserDetail(userId: any) {
    try {
      const result = await this.usersRepository.findOne({
        where: { userId: userId },
        relations: {
          busAssignedToConductor: true,
          busAssignedToDriver: true,
          refundDetails: true,
          tickets: { busDetail: true, passengers: true },
          payments: true,
        },
      });
      console.log(result);
      const { password, ...userData } = result;
      console.log(password);
      return userData;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async updateUserDetails(userData: any) {
    try {
      console.log(userData);
      const { userId, firstName, lastName, email, contact } = userData;
      const result = await this.usersRepository
        .createQueryBuilder()
        .update(User)
        .set({ firstName, lastName, email, contact })
        .where('userId=:userId', { userId })
        .execute();
      return result;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  async uploadUserImg(user, image) {
    const { userId } = user;
    try {
      const result = await this.usersRepository
        .createQueryBuilder()
        .update(User)
        .set({ image: image.filename })
        .where('userId=:userId', { userId })
        .execute();
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something unexpected happened',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  @Cron('* * * * *')
  async delExpiredOtpsForForgetPass() {
    const currentDate = new Date();
    const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfToday = new Date(currentDate.setHours(23, 59, 59, 999));

    const result = await this.forgetPassRequestRepo
      .createQueryBuilder('ForgetPassRequest')
      .softDelete()
      .where('createdAt BETWEEN :startOfToday AND :endOfToday', {
        startOfToday,
        endOfToday,
      })
      .andWhere('EXTRACT(MINUTE FROM createdAt) <= :currentMinute - :minDiff', {
        currentMinute: currentDate.getMinutes(),
        minDiff: 1,
      })
      .printSql()
      .execute();
    console.log(result);
  }
}
