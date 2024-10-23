import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Response,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Cron } from '@nestjs/schedule';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { EmailerService } from 'src/emailer/emailer.service';
import { MessagesService } from 'src/messages/messages.service';
@Controller('user')
export class UserController {
  constructor(
    private userService: UsersService,
    private emailService: EmailerService,
    private messageService: MessagesService,
  ) {}
  @Post('/register')
  async create(
    @Request() req,
    @Response() res,
    @Body()
    userData: any,
  ) {
    const result = await this.userService.registerUser(userData);
    if (result) {
      const channel = await this.messageService.createChannel(result.userId);
      console.log(channel);
    }
    res.status(HttpStatus.OK).json(result);
  }

  @Get('/logout')
  async logout(@Request() req, @Response() res) {
    console.log(req.cookies);
    res.clearCookie('token');
    res.status(HttpStatus.OK).json(true);
  }

  @Get('/getUserByEmail')
  async getUserByEmail(@Query('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @Post('/resetPassword')
  async resetPass(@Body() payload: any) {
    return this.userService.resetPass(payload);
  }

  @Get('/getAllUsers')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/getListOfConductors')
  async getListOfConductors() {
    return this.userService.getListOfConductors();
  }

  @Get('/getListOfDrivers')
  async getListOfDrivers() {
    return this.userService.getListOfDrivers();
  }
  @Get('/getUserById')
  async getUserById(@Query('userId') userId: number) {
    return this.userService.getUserById(userId);
  }

  @Get('/getOtpForForgetPassRequest')
  async getOtpForForgetPassRequest(
    @Request() req: any,
    @Query('email') email: string,
  ) {
    const user = await this.userService.getUserByEmail(email);
    const result = await this.userService.getOtpForForgetPassRequest(email);
    if (result == false) {
      return false;
    }
    const txt = 'Please Enter this otp to reset your password';
    const emailResult = await this.emailService.sendMail(email, txt, result);
    console.log(emailResult);
    return { userId: user.userId };
  }

  @Get('/checkForgetPassOtp')
  async checkForgetPassOtp(@Query() query: any) {
    return this.userService.checkForgetPassOtp(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getTotalUsers')
  async getTotalUsers() {
    return await this.userService.getTotalUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getUsersRegisteredPerMonth')
  async getUsersRegisteredPerMonth() {
    return await this.userService.getUsersRegisteredPerMonth();
  }

  @Get('/getRecentlyRegisteredUser')
  async getRecentlyRegisteredUser() {
    return await this.userService.getRecentlyRegisteredUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getLoggedInUserDetail')
  async getLoggedInUserDetail(@Request() req: any) {
    const user = req.user;
    return await this.userService.getLoggedInUserDetail(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/updateUserDetails')
  async updateUserDetails(@Body() userData: any) {
    return await this.userService.updateUserDetails(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/uploadUserImg')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async upload(@Request() req: any, @UploadedFile() file: any) {
    const user = req.user;
    return await this.userService.uploadUserImg(user, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getConductorDetails')
  async getConductorDetails(@Request() req: any) {
    const user = req.user;
    const { userId } = user;
    return await this.userService.getConductorDetails(userId);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/getTotalWorkingDaysPerMonth')
  async getTotalWorkingDaysPerMonth(@Request() req: any) {
    const user = req.user;
    return await this.userService.getTotalWorkingDaysPerMonth(3);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/getTotalAbsentDaysPerMonth')
  async getTotalAbsentDaysPerMonth(@Request() req: any) {
    const user = req.user;
    return await this.userService.getTotalAbsentDaysPerMonth(3);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/getProductivityRatioPerMonth')
  async getProductivityRatioPerMonth(@Request() req: any) {
    return await this.userService.getProductivityRatioPerMonth(3);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/markAsPresent')
  async markAsPresent(@Request() req: any) {
    return await this.userService.markAsPresent(3);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/checkIsTodaysAttendanceMarked')
  async checkIsTodaysAttendanceMarked(@Request() req: any) {
    return await this.userService.checkIsTodaysAttendanceMarked(3);
  }
}
