import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto } from '../dto/register.dto';

import * as bcrypt from 'bcrypt';
import { AuthService } from '../../auth/services/auth.service';
import { LoginResponse } from '../../auth/responses/LoginResponse';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findById(id: number) {
    return this.userRepository.findOne({ id });
  }
  async findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async register(registerDto: RegisterDto) {
    const user = await this.findByEmail(registerDto.email);
    if (user) throw new BadRequestException('User already exists');

    const encryptedPassword = await bcrypt.hash(registerDto.password, 10);
    const registeredUser = await this.userRepository.save({
      ...registerDto,
      password: encryptedPassword,
    });
    const tokens = await this.authService.login(
      registeredUser,
      registerDto.platform,
    );

    return new LoginResponse({
      ...registeredUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
}
