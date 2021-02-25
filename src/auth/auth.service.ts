import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserWithEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
  }

  async signIn(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: jwtConstants.ACCESS_TOKEN_SECRET,
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: jwtConstants.REFRESH_TOKEN_SECRET,
        expiresIn: '30d',
      }),
    };
  }
}
