import { Component, OnInit, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material';
import { User } from 'src/app/classes/User';
import { $ } from 'protractor';
import { TableComponent } from '../table/table.component';
import { TrackService } from 'src/app/services/track.service';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  request = [];

  constructor(private authService: AuthService, private router: Router, private userService: UserService, private trackService: TrackService, private snackBar: MatSnackBar) { }  
  
  openSnackBar(message: string) {
    this.snackBar.open(message, "Ok", {duration: 5000}).onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }

  ngOnInit() {
  }
  
  logout(): void {
    this.authService.logout();
  }

  getRequest(): any[] {
    return this.request;
  }

  getAllUsers() {
    this.userService.getAllUsers().then(res => {
      this.request = res;
      this.openSnackBar("Successfully retrieved users");
    }, err => {
      this.openSnackBar("Error retrieving users");
    });
  }

  getAllTracks() {
    this.trackService.getAllTracks().then(res => {
      this.request = res;
      this.openSnackBar("Successfully retrieved tracks");
    }, err => {
      this.openSnackBar("Error retrieving tracks");
    });
  }
}
