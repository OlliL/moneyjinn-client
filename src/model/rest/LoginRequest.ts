class InnerLoginRequest {
  userName: string;
  userPassword: string;
  constructor(userName: string, userPassword: string) {
    this.userName = userName;
    this.userPassword = userPassword;
  }
}

export class LoginRequest {
  loginRequest: InnerLoginRequest;

  constructor(userName: string, userPassword: string) {
    this.loginRequest = new InnerLoginRequest(userName, userPassword);
  }
}
