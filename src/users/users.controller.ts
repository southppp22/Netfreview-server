import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Patch,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { TokenService } from 'src/auth/token.service';
import { User } from 'src/entity/User.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {
    this.usersService = usersService;
    this.tokenService = tokenService;
  }

  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  async signIn(
    @Request() req,
    @Response({ passthrough: true }) res,
  ): Promise<string> {
    const { id } = req.user;
    await this.usersService.updateLastLogin(id);
    const accessToken = await this.tokenService.generateAccessToken(req.user);
    const refreshToken = await this.tokenService.generateRefreshToken(req.user);

    res.cookie('refreshToken', refreshToken);

    return Object.assign({
      data: { accessToken },
      message: '로그인이 성공적으로 되었습니다.',
    });
  }

  @Get('/refresh')
  async refresh(@Request() req: any): Promise<string> {
    const { refreshToken } = req.cookies;
    const { token } = await this.tokenService.createAccessTokenFromRefreshToken(
      refreshToken,
    );

    return Object.assign({
      data: { accessToken: token },
      message: 'success',
    });
  }

  @UseGuards(JwtAuthGuard) //test
  @Get('profile')
  getProfile(@Request() req) {
    console.log('controller');
    return req.user;
  }

  @Post('signout')
  async signOut(
    @Request() req,
    @Response({ passthrough: true }) res,
  ): Promise<string> {
    const { refreshToken } = req.cookies;
    const { user } = await this.tokenService.resolveRefreshToken(refreshToken);
    res.clearCookie('refreshToken');

    await this.tokenService.deleteRefreshTokenFromUser(user);
    await this.usersService.updateLastLogin(user.id);

    return '로그아웃 되었습니다.';
  }

  @Post('signup')
  async saveUser(@Body() user: User): Promise<string> {
    await this.usersService.saveUser(user);

    return '회원가입 되었습니다.';
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Request() req): Promise<string> {
    const { id } = req.user;
    this.usersService.deleteUser(id);
    return 'test';
  }
}
