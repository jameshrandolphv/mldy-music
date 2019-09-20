export class Email {
  email: string;

  constructor(email: string) {
    this.email = email;
  }

  public static fromJSON(json: any) {
    return new Email(json.email);
  }

  public getJSON() {
    return {
      "email": this.email
    };
  }

}