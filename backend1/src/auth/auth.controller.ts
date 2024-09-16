import {
  Controller,
  Post,
  Body,
  Response,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginAuth.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async create(@Body() payload: LoginDto, @Response() res: any) {
    const result = await this.authService.loginUser(payload);
    if (result != false) {
      res.cookie('token', result.token, {
        expires: new Date(new Date().getTime() + 30 * 1000),
        sameSite: 'lax',
        httpOnly: true,
      });
    }
    res.status(HttpStatus.OK).json(result);
  }
}
