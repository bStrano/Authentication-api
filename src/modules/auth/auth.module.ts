import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentModule } from '../../configs/environment/environment.module';
import { SessionModule } from '../session/session.module';
import { AuthController } from './controllers/auth.controller';
import { FinancialJwtStrategy } from './strategies/financial-jwt.strategy';
import { KeychainJwtStrategy } from './strategies/keychain-jwt.strategy';
import { FinancialJwtAuthGuard } from './guards/financial-jwt-auth.guard';
import { KeychainJwtAuthGuard } from './guards/keychain-jwt-auth.guard';
import { GoogleFinancialStrategy } from './strategies/google-financial.strategy';
import { GoogleKeychainStrategy } from './strategies/google-keychain.strategy';
import { GoogleLifeGamificationStrategy } from './strategies/google-life-gamification.strategy';
import { GoogleDynamicAuthGuard } from './guards/google-dynamic-auth.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    SessionModule,
    EnvironmentModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    FinancialJwtStrategy,
    KeychainJwtStrategy,
    GoogleFinancialStrategy,
    GoogleKeychainStrategy,
    GoogleLifeGamificationStrategy,
    FinancialJwtAuthGuard,
    KeychainJwtAuthGuard,
    GoogleDynamicAuthGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
