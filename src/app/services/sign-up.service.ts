import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Email } from '../classes/Email';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private emailsUrl = AppComponent.MONGO_DEBUG ? "http://localhost:8080/api/emails" : "/api/emails";

  constructor(private http: Http) { }

  // Post Email
  createEmail(newEmail: Email): Promise<Email> {
    return this.http.post(this.emailsUrl, newEmail)
      .toPromise()
      .then(response => response.json() as Email);
  }

  // Gets all emails from db
  getAllEmails(): Promise<Email[]> {
    return this.http.get(this.emailsUrl)
      .toPromise()
      .then(response => response.json().map(r => Email.fromJSON(r)));
  }


  public handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }
}