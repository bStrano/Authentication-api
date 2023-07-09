import {Module} from '@nestjs/common';
import {AuthController} from "./controllers/auth.controller";
import {AuthService} from "./services/auth.service";
import {LocalStrategy} from "./strategies/local.strategy";
import {PassportModule} from "@nestjs/passport";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "@nestjs/config";
import {EnvironmentService} from "../../configs/environment/environment.service";
import {EnvironmentModule} from "../../configs/environment/environment.module";
import {JwtStrategy} from "./strategies/jwt.strategy";


@Module({
  imports: [UsersModule, PassportModule,
    JwtModule.registerAsync({
      imports: [EnvironmentModule, JwtModule, ConfigModule],
      useFactory: async (configService: EnvironmentService) => ({
        secret: configService.jwtSecret,
        signOptions: {
          expiresIn: `${configService.jwtAccessTokenExpirationTime}s`,
        },
      }),
      inject: [EnvironmentService],
    }),
    EnvironmentModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
