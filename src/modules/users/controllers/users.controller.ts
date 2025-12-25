import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { RegisterDto } from '../dto/register.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Throttle({ short: { limit: 3, ttl: 60000 } }) // 3 registrations per minute
  @Post('/register')
  async register(@Body() body: RegisterDto) {
    return this.userService.register(body);
  }
}
