import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Http } from '@angular/http';
import * as moment from "moment";
import { UserService } from './user.service';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { refreshDescendantViews } from '@angular/core/src/render3/instructions';
import { BlockScrollStrategy } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  private message: string;
  private baseUrl = AppComponent.MONGO_DEBUG ? "http://localhost:8080/" : "/";

  constructor(private router: Router, private http: Http, private userService: UserService) { }

  /* JWT + Express JWT Impl */

    login(email:string, password:string ) {
      return this.userService.userLogin(email, password)
        .then((res) => this.setSession(res));
    }

    private setSession(authResult) {
      const expiresAt = moment().add(authResult.access.expiresIn,'minutes');
      sessionStorage.setItem('access', authResult.access.idToken);
      sessionStorage.setItem('refresh', authResult.refresh.token);
      sessionStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
      sessionStorage.setItem('id', authResult.userId);
      this.userService.getSignedInUser();
    } 

    logout() {
      sessionStorage.removeItem("access");
      sessionStorage.removeItem("expires_at");
      sessionStorage.removeItem('refresh');
      sessionStorage.removeItem('id');
      this.router.navigate(['/landing']);
    }

    public isAuthenticated(): Promise<boolean> {
      if(!moment().isBefore(this.getExpiration())) {
        return this.refreshSession().then(res => {
          return res;
        }, err => {
          return false;
        });
      } else {
        return Promise.resolve(true);
      }
    }

    public isAdmin() {
      const bearerToken = sessionStorage.getItem("access");
      return this.http.post(this.baseUrl + 'api/admin', { 'token': bearerToken })
        .toPromise()
        .then(res => res.json());
    }
    

    isLoggedOut() {
      return !this.isAuthenticated();
    }

    async refreshSession() {
      const bearerToken = sessionStorage.getItem("refresh");
      return await this.http.post(this.baseUrl + 'api/refresh', { 'token': bearerToken })
        .toPromise()
        .then(res => {
          const access = res.json();
          const expiresAt = moment().add(access.expiresIn,'minutes');
          sessionStorage.setItem('access', access.idToken);
          sessionStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
          return true;
        }, err => {
          return false;
        });
    }

    getExpiration() {
        const expiration = sessionStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }  

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      let out = this.isAdmin().then(res => res, err => {
        if(err) {
          // if user not authenticated, redirects to landing page or previous url
          this.router.navigate([this.router.url === '/admin' ? '/landing' : this.router.url]);
          // you can save redirect url so after authing we can move them back to the page they requested
          return false;
        }
      });
      return out;
      
    }

}
