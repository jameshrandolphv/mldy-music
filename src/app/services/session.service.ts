import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Http } from '@angular/http';
import { User } from '../classes/User';
import { Session } from '../classes/Session';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionUrl = AppComponent.MONGO_DEBUG ? "http://localhost:8080/api/sessions/" : "/api/sessions/";
  sessions = [];
  private currentUser: User;
  constructor(private userService: UserService, private http: Http) {
    this.currentUser = userService.signedInUser;
    this.getAllSessions().then(res => {
      this.sessions = res;
      this.initLocations(this.sessions);
    })
  }

  getAllSessions(): Promise<Session[]> {
    return this.http.get(this.sessionUrl+'?userId='+this.currentUser._id)
      .toPromise()
      .then(response => response.json().map(r => Session.fromJSON(r)));
  }

  deleteSession(ip: string): Promise<String> {
    return this.http.delete(this.sessionUrl+'?ip='+ip)
      .toPromise()
      .then(res => res.json() as String);
  }

  initLocations(arr: Session[]) {
    arr.map(async s => {
      s.location = await this.iplocation(s.ip).then(res => res);
      return s;
    }); 
  }

  async iplocation(ip: string): Promise<string> {
    return await this.http.get("https://ipapi.co/" + ip + "/json/")
      .toPromise()
      .then(res => {
        let out = res.json().city + ", " + res.json().region_code + " " + res.json().country;
        return out;
      }, err => "");
  }
}
