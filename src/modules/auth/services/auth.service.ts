import {Injectable} from '@nestjs/common';
import {UsersService} from "../../users/services/users.service";
import {JwtService} from '@nestjs/jwt';
import {TokenPayloadInterface} from "../types/TokenPayloadInterface";
import {User} from "../../users/entities/user.entity";

@Injectable()
export class AuthService {

  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {
  }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload: TokenPayloadInterface = { email: user.email, sub: user.id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
