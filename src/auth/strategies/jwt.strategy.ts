import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from 'src/users/dto/UserDto';
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
  async validate(payload: any): Promise<UserDto | null> {
    const { sub: id, iat } = payload;
    const user = await this.usersService.findUserWithUserId(id);

    if (!user) {
      throw new UnauthorizedException('유효하지 않은 유저입니다.');
    }

    const accessTokenIat = new Date(iat * 1000 + 1000);
    const { lastLogin } = user;

    if (accessTokenIat < lastLogin) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    delete user.password;
    return user;
  }
}
