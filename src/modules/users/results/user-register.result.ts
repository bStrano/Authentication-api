export class UserRegisterResult {
  id: number;
  name: string;
  lastName: string;
  email: string;
  accessToken: string;
  refreshToken: string;

  constructor(props: UserRegisterResult) {
    this.id = props.id;
    this.name = props.name;
    this.lastName = props.lastName;
    this.email = props.email;
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
  }
}
