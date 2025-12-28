import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
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
import { Throttle } from '@nestjs/throttler';
import { GoogleDynamicAuthGuard } from '../guards/google-dynamic-auth.guard';
import { EnvironmentService } from '../../../configs/environment/environment.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly environmentService: EnvironmentService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 login attempts per minute
  @Post('login')
  async login(@Request() req, @Body() body: LoginDto) {
    return this.authService.login(req.user, body.platform);
  }

  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 session refresh per minute
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

  @Get('google')
  @UseGuards(GoogleDynamicAuthGuard)
  async googleAuth() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(GoogleDynamicAuthGuard)
  async googleAuthRedirect(
    @Request() req,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    // Extrai o platform do state
    let platformEnum: number;
    try {
      const stateObj = JSON.parse(state);
      platformEnum = stateObj.platform;
    } catch {
      platformEnum = null;
    }

    const tokens = await this.authService.login(req.user, platformEnum);

    const frontendUrl = this.environmentService.frontendUrl(platformEnum);
    const redirectUrl = `${frontendUrl}/auth/callback?` +
      `accessToken=${encodeURIComponent(tokens.accessToken)}&` +
      `refreshToken=${encodeURIComponent(tokens.refreshToken.code)}&` +
      `id=${tokens.id}&` +
      `email=${encodeURIComponent(tokens.email)}&` +
      `name=${encodeURIComponent(tokens.name)}&` +
      `lastName=${encodeURIComponent(tokens.lastName)}`;

    return res.redirect(redirectUrl);
  }
}
