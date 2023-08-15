export class Contac {
  public contactId? : number;
  public contactFirstName: string;
  public contactLastName: string;
  public contactCompany: string;
  public contactBirthday: string;
  public contactNotes: string;
  public contactAlias: string;
  public contactPhoto: string;
  public contactEmails: DataEmails[];
  public contactTags: DataTags[];
  public contactPhones: DataPhones[];

  constructor(contactId: number, contactFirstName: string, contactLastName: string, contactCompany: string, contactBirthday: string, contactNotes: string, contactAlias: string, contactPhoto: string, contactEmails: DataEmails[], contactTags: DataTags[], contactPhones: DataPhones[]){

    this.contactId = contactId;
    this.contactFirstName = contactFirstName;
    this.contactLastName = contactLastName;
    this.contactCompany = contactCompany;
    this.contactBirthday = contactBirthday;
    this.contactNotes = contactNotes;
    this.contactAlias = contactAlias;
    this.contactPhoto = contactPhoto;
    this.contactEmails = contactEmails;
    this.contactTags = contactTags;
    this.contactPhones = contactPhones;

}
}
export class ResultData {
  public list: Contac[];
  public count: number;

  constructor(list: Contac[], count: number) {
    this.list = list;
    this.count = count;
  }
}

export class DataResponse {
  succeed: boolean;
  statusCode: number;
  code: number;
  result: any;
  message: string;
  friendlyMessage: string[];
  error: string;
  created: Date;

  constructor(succeed: boolean, statusCode: number, code: number, result: ResultData, message: string, friendlyMessage: string[], error: string, created: Date) {
    this.succeed = succeed;
    this.statusCode = statusCode;
    this.code = code;
    this.result = result;
    this.message = message;
    this.friendlyMessage = friendlyMessage;
    this.error = error;
    this.created = created;

  }
}


export class DataEmails{
  emailId: number;
  emailValue: string;

  constructor(emailId: number, emailValue: string){
    this.emailId = emailId;
    this.emailValue = emailValue;
  }

}

export class DataTags {
  tagId: number;
  tagValue: string;

  constructor(tagId: number, tagValue: string) {
    this.tagId = tagId;
    this.tagValue = tagValue;
  }

}

export class DataPhones {
  phoneId: number;
  phoneValue: string;
  phoneType: string;

  constructor(phoneId: number, phoneValue: string, phoneType: string) {
    this.phoneId = phoneId;
    this.phoneValue = phoneValue;
    this.phoneType = phoneType;
  }
}

export class CreateContacts {
  succeed: boolean;
  statusCode: number;
  code: number;
  result: any;
  message: string;
  friendlyMessage: string[];
  htmlMessage: string;
  error: string;
  created: Date;

  constructor(succeed: boolean, statusCode: number, code: number, result: Contac, message: string, friendlyMessage: string[], htmlMessage: string, error: string, created: Date) {
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
