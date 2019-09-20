import { Injectable } from '@angular/core';
import { User } from '../classes/User';
import { Http, Response } from '@angular/http';
import { AppComponent } from '../app.component';
import { AuthService } from './auth.service';
import jwt from 'jsonwebtoken';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[];
  private usersUrl = AppComponent.MONGO_DEBUG ? "http://localhost:8080/api/users" : "/api/users";
  private loginUrl = AppComponent.MONGO_DEBUG ? "http://localhost:8080/login" : "/login";
  public signedInUser;
  userBeingVisited: User;


  constructor(private http: Http) {
  }

  userLogin(email: string, password: string): Promise<User> {
    return this.http.post(this.loginUrl, { 'email': email, 'password': password })
      .toPromise()
      .then(response => response.json());
  }

  // Gets all users from db
  getAllUsers(): Promise<User[]> {
    return this.http.get(this.usersUrl)
      .toPromise()
      .then(response => response.json().map(r => User.fromJSON(r)));
  }

  // Get user from db
  getUserWithId(userId: String): Promise<User> {
    return this.http.get(this.usersUrl + '/' + userId)
      .toPromise()
      .then(response => User.fromJSON(response.json()));
  }

  // Post user to db
  createUser(newUser: User, password: string): Promise<User> {
    let request = {};
    request['user'] = newUser.getJSON();
    request['password'] = password;
    return this.http.post(this.usersUrl, request)
      .toPromise()
      .then(response => User.fromJSON(response.json()));
  }

  // Remove user from db
  deleteUser(userId: String): Promise<String> {
    return this.http.delete(this.usersUrl + '/' + userId)
      .toPromise()
      .then(response => response.json() as String);
  }

  // Update a user in db
  updateUser(user: User): Promise<User> {
    let putUserUrl = this.usersUrl + '/' + user._id;
    return this.http.put(putUserUrl, user.getJSON())
      .toPromise()
      .then(response => User.fromJSON(response.json()));
  }

  getSignedInUser(): Promise<User> {
    let id = sessionStorage.getItem('id');
    // jwt.verify(token, token.)
    // TODO: TEMPORARY!!
    return this.getUserWithId(id)
      .then(res => this.signedInUser = res)
      .catch();
  }

  getUserBeingVisited() {
    return this.userBeingVisited;
  }

  public handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
  }

}
