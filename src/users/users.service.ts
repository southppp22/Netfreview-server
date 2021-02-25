import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/User.entity';
import { Repository } from 'typeorm';

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

  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
