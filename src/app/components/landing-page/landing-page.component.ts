import { Component, OnInit } from '@angular/core';
import { SignUpService } from 'src/app/services/sign-up.service';
import { Email } from 'src/app/classes/Email';
// import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  host: { class: 'router' },
})
export class LandingPageComponent implements OnInit {

  private email = "";
  private invalidEmailText = "";

  constructor(public dialog: MatDialog, private signUpService: SignUpService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  validateAndPostEmail() {
    if (this.validateEmail()) {
      this.signUpService.createEmail(new Email(this.email)).then(
        res => {
          this.email = "";
          this.invalidEmailText = "Thank you!";
        },
        err => {
          this.invalidEmailText = "Error submitting email";
        }
      );
    } else {
      this.invalidEmailText = "Invalid Email";
    }
  }

  validateEmail() {

    let isemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return isemail.test(this.email);

    // return RegExp("/^[^\s@]+@[^\s@]+\.[^\s@]+$/").test(this.email);

  }
  openSignInDialog() {
    this.authService.isAuthenticated().then(res => {
      if(res) {
        this.router.navigate(['discover']);
      } else {
        const dialogRef = this.dialog.open(LoginComponent, {
          width: '500px',
          height: '420px',
          data: { },
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }
    });
  }
  openCreateAccountDialog() {
    const dialogRef = this.dialog.open(CreateAccountComponent, {
      width: '500px',
      height: '520px',
      data: { },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }
 

}
