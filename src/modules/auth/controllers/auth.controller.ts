import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { KeychainJwtAuthGuard } from '../guards/keychain-jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { LoginSessionDto } from '../dto/login-session.dto';
import { FinancialJwtAuthGuard } from '../guards/financial-jwt-auth.guard';
import {
  MultipleAuthorizeGuard,
  MultipleGuardsReferences,
} from '../../../shared/guards/MultipleAuthorizeGuard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() body: LoginDto) {
    return this.authService.login(req.user, body.platform);
  }

  @Patch('session')
  async loginSession(@Body() loginSessionDto: LoginSessionDto) {
    return this.authService.loginSession(loginSessionDto);
  }

  @UseGuards(MultipleAuthorizeGuard)
  @MultipleGuardsReferences(KeychainJwtAuthGuard, FinancialJwtAuthGuard)
  @ApiBearerAuth()
  @Delete('logout/:code')
  async logout(@Request() req, @Param('code') code: string) {
    return this.authService.logout(req.user?.sub, code);
  }
}
