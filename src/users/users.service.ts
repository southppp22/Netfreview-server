import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { User } from 'src/entity/User.entity';
import { Repository } from 'typeorm';
import { UpdateUserInfoDto } from './dto/UpdateUserInfoDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.userRepository = userRepository;
  }

  async findUserWithUserId(userId: number): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async findUserWithEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUserWithNickname(nickname: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { nickname } });
  }

  async validateCredentials(user: User, password: string): Promise<boolean> {
    return compare(password, user.password);
  }

  async updateLastLogin(id: number): Promise<void> {
    const user = await this.findUserWithUserId(id);
    user.lastLogin = new Date();
    this.userRepository.save(user);
  }

  async saveUser(user: User, provider?: string): Promise<User> {
    const { email, nickname } = user;
    let existingUser = await this.findUserWithEmail(email);

    if (existingUser) {
      throw new UnprocessableEntityException('이미 존재하는 이메일입니다.');
    }
    existingUser = await this.findUserWithNickname(nickname);

    if (existingUser) {
      throw new UnprocessableEntityException('이미 존재하는 닉네임입니다.');
    }

    if (provider) {
      user.password = await hash(Math.random().toString(36), 10);
    } else {
      user.password = await hash(user.password, 10);
    }
    user.lastLogin = new Date();

    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete({ id });
  }

  async updateUserInfo(user: User, dto: UpdateUserInfoDto): Promise<void> {
    if (Object.keys(dto).length !== 1) {
      throw new BadRequestException('요청이 올바르지 않습니다.');
    }
    const [[column, data]] = Object.entries(dto);
    user[column] = data;
    await this.userRepository.save(user);
  }
}
