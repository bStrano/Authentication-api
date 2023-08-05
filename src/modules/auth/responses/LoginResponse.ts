import { RefreshTokens } from '../../session/entities/refresh.tokens.entity';
export class LoginResponse {
  id: number;
  email: string;
  name: string;
  lastName: string;
  accessToken: string;
  refreshToken: RefreshTokens;

  constructor(props: LoginResponse) {
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.lastName = props.lastName;
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
  }
}
