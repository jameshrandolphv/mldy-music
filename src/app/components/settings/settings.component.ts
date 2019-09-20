import { Component, OnInit } from '@angular/core';
import { SignUpService } from 'src/app/services/sign-up.service';
import { Email } from 'src/app/classes/Email';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/User';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // public signedInUser = ;
  user: User;
  everythingLoaded = false;

  constructor(private signUpService: SignUpService, 
    private userService: UserService, private router: Router, private snackBar: MatSnackBar) {
      this.userService.getSignedInUser().then(res => {
        this.user = res;
        this.everythingLoaded = true;

      });
  }

  ngOnInit() {
  }
  putUser() {
    this.userService.updateUser(this.user).then(res => {
      this.user = res;
      this.router.navigate(["profile"]);
      // this.openSnackBar("Changes successfully saved.");
    });
  }

}
