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
import { ConductorAttendance } from './entities/Attendance.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(TicketDetail)
    private ticketDetailRepo: Repository<TicketDetail>,
    @InjectRepository(ForgetPassRequest)
    private forgetPassRequestRepo: Repository<ForgetPassRequest>,
    @InjectRepository(ConductorAttendance)
    private conductorAttendanceRepo: Repository<ConductorAttendance>,
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

  async getConductorDetails(userId: any) {
    const result = await this.usersRepository.findOne({
      where: { userId: userId },
      relations: {
        busAssignedToConductor: true,
        busAssignedToDriver: true,
        attendance: true,
      },
    });
    return result;
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

  async markAsPresent(userId: any) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const result = await this.conductorAttendanceRepo
      .createQueryBuilder('attendance')
      .update(ConductorAttendance)
      .set({ isPresent: true })
      .where('userId=:userId AND attendanceDate=:currentDate', {
        userId,
        currentDate,
      })
      .execute();
    console.log(result);
    return result;
  }

  async checkIsTodaysAttendanceMarked(userId: any) {
    const currentDate = new Date();
    console.log(currentDate);
    currentDate.setHours(0, 0, 0, 0);
    console.log(currentDate);
    try {
      const result = await this.conductorAttendanceRepo
        .createQueryBuilder('attendance')
        .where('userId=:userId', {
          userId: userId,
        })
        .andWhere('attendanceDate=:currentDate', { currentDate: currentDate })
        .andWhere('isPresent=:isPresent', { isPresent: true })
        .getOne();
      return result ? true : false;
    } catch (err) {
      console.log(err);
    }
  }
  @Cron('0 0 1 * *')
  async createAttendanceChartPerMonth() {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.busAssignedToConductor', 'conductorBusDetail')
      .leftJoinAndSelect('user.busAssignedToDriver', 'driverBusDetail')
      .where('user.role in (:...roles)', { roles: [3, 2] })
      .andWhere('user.isAssigned=:isAssigned', { isAssigned: true })
      .getMany();
    console.log(users);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const datesOfMonth = [];
    if (
      currentMonth == 0 ||
      currentMonth == 2 ||
      currentMonth == 4 ||
      currentMonth == 6 ||
      currentMonth == 7 ||
      currentMonth == 9 ||
      currentMonth == 10
    ) {
      let currentDay = currentDate.getDay();
      for (let i = 0; i < 31; i++) {
        const date = `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1}-${i < 9 ? '0' + (i + 1) : i + 1}`;
        if (currentDay < 7) {
          datesOfMonth.push({ date: date, day: currentDay });
          currentDay++;
        } else {
          currentDay = 0;
          datesOfMonth.push({ date: date, day: currentDay });
        }
      }
    } else {
      let currentDay = currentDate.getDay();
      for (let i = 0; i < 30; i++) {
        const date = `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1}-${i < 9 ? '0' + (i + 1) : i + 1}`;
        if (currentDay < 7) {
          datesOfMonth.push({ date: date, day: currentDay });
          currentDay++;
        } else {
          currentDay = 0;
          datesOfMonth.push({ date: date, day: currentDay });
          currentDay++;
        }
      }
    }

    users.forEach((user) => {
      const userId: any = user.userId;

      if (user.busAssignedToConductor != null) {
        const busId: any = user.busAssignedToConductor.busId;
        const workingDays = user.busAssignedToConductor?.workingDays
          .split(',')
          .map((day) => {
            return parseInt(day);
          });
        console.log(workingDays);
        datesOfMonth.forEach(async (date) => {
          if (workingDays.includes(date.day)) {
            const result = await this.conductorAttendanceRepo
              .createQueryBuilder()
              .insert()
              .into(ConductorAttendance)
              .values({
                attendanceDate: date.date,
                user: userId,
                busDetail: busId,
              })
              .execute();
            console.log(result);
          }
        });
      }
      if (user.busAssignedToDriver != null) {
        const busId: any = user.busAssignedToDriver.busId;
        const workingDays = user.busAssignedToDriver?.workingDays
          .split(',')
          .map((day) => {
            return parseInt(day);
          });
        console.log('workingDays ', workingDays);
        datesOfMonth.forEach(async (date) => {
          if (workingDays.includes(date.day)) {
            const result = await this.conductorAttendanceRepo
              .createQueryBuilder()
              .insert()
              .into(ConductorAttendance)
              .values({
                attendanceDate: date.date,
                user: userId,
                busDetail: busId,
              })
              .execute();
            console.log(result);
          }
        });
      }
    });
  }

  async getTotalWorkingDaysPerMonth(userId: any) {
    const currentTimestamp = new Date();
    try {
      const result = await this.conductorAttendanceRepo
        .createQueryBuilder('attendance')
        .where('EXTRACT(YEAR FROM attendanceDate)=:currentYear', {
          currentYear: currentTimestamp.getFullYear(),
        })
        .andWhere('EXTRACT(MONTH FROM attendanceDate)=:currentMonth', {
          currentMonth: currentTimestamp.getMonth() + 1,
        })
        .andWhere('userId = :userId', { userId })
        .andWhere('isPresent= :isPresent', { isPresent: true })
        .getOne();
      console.log('present ' + result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async getTotalAbsentDaysPerMonth(userId: any) {
    const currentTimestamp = new Date();
    try {
      const result = await this.conductorAttendanceRepo
        .createQueryBuilder('attendance')
        .where(
          'EXTRACT(YEAR FROM attendanceDate)=:currentYear AND EXTRACT(MONTH FROM attendanceDate)=:currentMonth',
          {
            currentYear: currentTimestamp.getFullYear(),
            currentMonth: currentTimestamp.getMonth() + 1,
          },
        )
        .andWhere('userId = :userId', { userId })
        .andWhere('isPresent= :isPresent', { isPresent: false })
        .getCount();
      console.log('absent ' + result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async getProductivityRatioPerMonth(userId: any) {
    const currentTimestamp = new Date();
    try {
      const totalDaysPresent = await this.conductorAttendanceRepo
        .createQueryBuilder('attendance')
        .where(
          'EXTRACT(YEAR FROM attendanceDate)=:currentYear AND EXTRACT(MONTH FROM attendanceDate)=:currentMonth',
          {
            currentYear: currentTimestamp.getFullYear(),
            currentMonth: currentTimestamp.getMonth() + 1,
          },
        )
        .andWhere('userId = :userId', { userId })
        .andWhere('isPresent= :isPresent', { isPresent: true })
        .getCount();

      const totalDays = await this.conductorAttendanceRepo
        .createQueryBuilder('attendance')
        .where(
          'EXTRACT(YEAR FROM attendanceDate)=:currentYear AND EXTRACT(MONTH FROM attendanceDate)=:currentMonth',
          {
            currentYear: currentTimestamp.getFullYear(),
            currentMonth: currentTimestamp.getMonth() + 1,
          },
        )
        .andWhere('userId = :userId', { userId })
        .getCount();

      const ratio = (totalDaysPresent / totalDays).toFixed(2);
      console.log('totalDaysPresent ' + totalDaysPresent);
      console.log('totalDays' + totalDays);
      console.log('ratio =>' + ratio);
      return ratio;
    } catch (err) {
      console.log(err);
    }
  }
}
