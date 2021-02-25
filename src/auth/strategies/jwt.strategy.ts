import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    const { sub: id, iat } = payload;
    const user = await this.usersService.findUserWithUserId(id);

    if (!user) {
      return null;
    }

    const accessTokenIat = new Date(iat * 1000 + 1000);
    const { lastLoginDate } = user;

    if (accessTokenIat < lastLoginDate) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }
}
