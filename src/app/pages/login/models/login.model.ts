
export class LoginModel {
  succeed: boolean;
  statusCode: number;
  code: number;
  result: any;
  message: string;
  friendlyMessage: string[];
  htmlMessage: string;
  error: string;
  created: Date;

  constructor(succeed: boolean, statusCode: number, code: number, result: DataResult, message: string, friendlyMessage: string[], htmlMessage: string, error: string, created: Date) {
    this.succeed = succeed;
    this.statusCode = statusCode;
    this.code = code;
    this.result = result;
    this.message = message;
    this.friendlyMessage = friendlyMessage;
    this.htmlMessage = htmlMessage;
    this.error = error;
    this.created = created;

  }

}

export class DataResult {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;

  constructor(accessToken:string, refreshToken: string, expiresAt: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;
  }

}

