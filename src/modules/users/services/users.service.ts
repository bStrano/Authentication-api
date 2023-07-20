import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto } from '../../auth/dto/register.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: number) {
    return this.userRepository.findOne({ id });
  }
  async findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async register(registerDto: RegisterDto) {
    const encryptedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.userRepository.save({
      ...registerDto,
      password: encryptedPassword,
    });
  }
}
