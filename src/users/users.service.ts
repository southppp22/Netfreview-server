import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { getDateInHour } from 'src/common/utils/date.util';
import { createRandomString } from 'src/common/utils/string.util';
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

  async findUserWithUserId(userId: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async findUserWithEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUserWithNickname(nickname: string): Promise<User> {
    return await this.userRepository.findOne({ where: { nickname } });
  }

  async validateCredentials(user: User, password: string): Promise<boolean> {
    return compare(password, user.password);
  }

  async findUserWithName(name: string): Promise<User> {
    return await this.userRepository.findOne({ where: { name } });
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = await this.findUserWithUserId(id);
    user.lastLogin = new Date();
    await this.userRepository.save(user);
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

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete({ id });
  }

  async updateUserInfo(user: User, dto: UpdateUserInfoDto): Promise<void> {
    const entries = Object.entries(dto);

    for (const entry of entries) {
      const [column, data] = entry;
      user[column] = data;
    }
    await this.userRepository.save(user);
  }

  async generateRandomNickname(): Promise<string> {
    let nickname = createRandomString(10);
    let isExist = await this.findUserWithNickname(nickname);

    while (isExist) {
      nickname = createRandomString(10);
      isExist = await this.findUserWithNickname(nickname);
    }
    return nickname;
  }

  async changePasswordAfterhour(id: string, password: string) {
    const DateInHour = getDateInHour();
    const t = await this.userRepository.query(`
    CREATE EVENT test1
    ON SCHEDULE
        AT '${DateInHour}'
    COMMENT 'update password'
    DO 
    UPDATE user
    SET password = '${password}'
    WHERE id = '${id}'
    `);
    console.log(t);
  }
}
