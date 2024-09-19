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
}
