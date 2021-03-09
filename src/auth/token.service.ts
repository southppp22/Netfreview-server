import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenExpiredError } from 'jsonwebtoken';
import { RefreshToken } from 'src/entity/RefreshToken.entity';
import { User } from 'src/entity/User.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RefreshTokenPayload } from './interfaces/refreshTokenPayload.interface';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(RefreshToken)
    private refreshRepository: Repository<RefreshToken>,
  ) {
    this.jwtService = jwtService;
    this.usersService = usersService;
  }

  async findTokenById(id: string): Promise<RefreshToken | null> {
    return this.refreshRepository.findOne({ where: { id } });
  }

  async createRefreshToken(user: User): Promise<RefreshToken> {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;

    const existedToken = await this.refreshRepository
      .createQueryBuilder('refreshToken')
      .leftJoinAndSelect('refreshToken.user', 'user')
      .where('user.id = :id', { id: user.id })
      .getOne();

    if (existedToken) {
      await this.refreshRepository
        .createQueryBuilder('refreshToken')
        .delete()
        .where('id = :id', { id: existedToken.id })
        .execute();
    }

    await this.refreshRepository.save(refreshToken);
    return refreshToken;
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id };

    const opts = {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '2h',
    };
    return this.jwtService.sign(payload, opts);
  }

  async resolveAccessToken(encoded: string) {
    try {
      return this.jwtService.verify(encoded, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (e) {
      return null;
    }
  }

  async generateRefreshToken(user: User): Promise<string> {
    const token: RefreshToken = await this.createRefreshToken(user);
    const payload = { email: user.email, sub: user.id };

    const opts = {
      jwtid: String(token.id),
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '30d',
    };
    return this.jwtService.sign(payload, opts);
  }

  async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: User; token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException('토큰이 존재하지 않습니다.');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('유효하지 않은 토큰입니다.');
    }

    return { user, token };
  }

  async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: User }> {
    const { user } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { user, token };
  }

  async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('유효하지 않은 토큰입니다.');
      }
    }
  }

  async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<User> {
    const subId = payload.sub;

    if (!subId) {
      throw new UnprocessableEntityException('유효하지 않은 토큰입니다.');
    }

    return this.usersService.findUserWithUserId(subId);
  }

  async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken> {
    const tokenId = payload.jti;
    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }
    return this.findTokenById(tokenId);
  }

  async deleteRefreshTokenFromUser(user: User): Promise<void> {
    await this.refreshRepository
      .createQueryBuilder('refreshToken')
      .leftJoinAndSelect('refreshToken.user', 'user')
      .delete()
      .where('user.id = :id', { id: user.id })
      .execute();
  }
}
