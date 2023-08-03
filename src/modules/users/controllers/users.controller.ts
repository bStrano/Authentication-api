import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { RegisterDto } from '../dto/register.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    return this.userService.register(body);
  }
}
