import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenExpiredError } from 'jsonwebtoken';
import { RefreshToken } from 'src/entity/RefreshToken.entity';
import { User } from 'src/entity/User.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { jwtConstants } from './constants';

export interface RefreshTokenPayload {
  jti: string;
  sub: number;
  email: string;
}

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

  async findTokenById(id: number): Promise<RefreshToken | null> {
    return this.refreshRepository.findOne({ where: { id } });
  }

  async createRefreshToken(user: User): Promise<RefreshToken> {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.isRevoked = false;
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
      secret: jwtConstants.ACCESS_TOKEN_SECRET,
      expiresIn: '2h',
    };
    return this.jwtService.sign(payload, opts);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const token: RefreshToken = await this.createRefreshToken(user);
    const payload = { email: user.email, sub: user.id };

    const opts = {
      jwtid: String(token.id),
      secret: jwtConstants.REFRESH_TOKEN_SECRET,
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
      throw new UnprocessableEntityException('Refresh token not found');
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException('Refresh token revoked');
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
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
        secret: jwtConstants.REFRESH_TOKEN_SECRET,
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<User> {
    const subId = payload.sub;

    if (!subId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.usersService.findUserWithUserId(subId);
  }

  async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken | null> {
    const tokenId = payload.jti;

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }
    return this.findTokenById(Number(tokenId));
  }

  async destoryRefreshTokenFromUser(user: User): Promise<any> {
    return await this.refreshRepository
      .createQueryBuilder('refreshToken')
      .leftJoinAndSelect('refreshToken.user', 'user')
      .delete()
      .where('user.id = :id', { id: user.id })
      .execute();
  }
}
