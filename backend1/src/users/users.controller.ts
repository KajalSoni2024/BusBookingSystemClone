import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Response,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';

@Controller('user')
export class UserController {
  constructor(private userService: UsersService) {}
  @Post('/register')
  async create(
    @Request() req,
    @Response() res,
    @Body()
    userData: any,
  ) {
    const result = await this.userService.registerUser(userData);
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
}
