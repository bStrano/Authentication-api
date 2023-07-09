import {Module} from '@nestjs/common';
import {AuthController} from "./controllers/auth.controller";
import {AuthService} from "./services/auth.service";
import {LocalStrategy} from "./strategies/local.strategy";
import {PassportModule} from "@nestjs/passport";
import {UsersModule} from "../users/users.module";


@Module({
  imports: [UsersModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
