import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {EnvironmentService} from "../../../configs/environment/environment.service";
import {TokenPayloadInterface} from "../types/TokenPayloadInterface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {


  constructor(private readonly environmentService: EnvironmentService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environmentService.jwtSecret,
    });
  }

  async validate(payload: TokenPayloadInterface) {
    return { email: payload.email, sub: payload.sub, name: payload.name };
  }
}
