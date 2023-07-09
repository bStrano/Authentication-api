import {Controller, Post, Request, UseGuards} from '@nestjs/common';
import {AuthService} from "../services/auth.service";
import {LocalAuthGuard} from "../guards/local-auth.guard";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
