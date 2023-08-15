export class UserModel {
  succeed: boolean;
  statusCode: number;
  code: number;
  result: any;
  message: string;
  friendlyMessage: string[];
  htmlMessage: string;
  error: string;
  created: Date;

  constructor(succeed: boolean, statusCode: number, code: number, result: Users, message: string, friendlyMessage: string[], htmlMessage: string , error: string, created: Date) {
    this.succeed = succeed;
    this.statusCode = statusCode;
    this.code = code;
    this.result = result;
    this.message = message;
    this.friendlyMessage = friendlyMessage
    this.htmlMessage = htmlMessage;
    this.error = error;
    this.created = created;
  }
}


export class Users {
  userId?: string;
  userFullName: string;
  userName: string;
  userPassword: string;
  userEmail: string;
  userPhoto: string;

  constructor(userId: string, userFullName: string, userName: string, userPassword: string, userEmail: string, userPhoto: string) {
    this.userId = userId;
    this.userFullName = userFullName;
    this.userName = userName;
    this.userPassword = userPassword;
    this.userEmail = userEmail;
    this.userPhoto = userPhoto;
  }
}


export class ResultDataUser {
  public list: Users[];
  public count: number;

  constructor(list: Users[], count: number) {
    this.list = list;
    this.count = count;
  }
}

  export class ResultUser {
    public user:  Users;

    constructor(user: Users) {
      this.user = user;
    }
}


