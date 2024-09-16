import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/loginAuth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async loginUser(payload: LoginDto): Promise<any> {
    const result = await this.userService.findByColumn({
      email: payload.email,
    });
    console.log(payload);
    if (result) {
      try {
        const isSame = await bcrypt.compare(payload.password, result.password);
        if (isSame) {
          const payload = { userId: result.userId, email: result.email };
          const access_token = await this.jwtService.signAsync(payload);
          return { token: access_token, role: result.role };
        } else {
          return false;
        }
      } catch (err) {
        console.log(err);
        return false;
      }
    } else {
      return false;
    }
  }

  async getValidUser(email: string, password: string) {
    console.log(password);
    const result = await this.userService.findByColumn({ email: email });
    return result;
  }
}
