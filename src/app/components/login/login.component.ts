import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar, private userService: UserService, private authService: AuthService, private router: Router) { }
  email: string;
  password: string;
  
  ngOnInit() {
  
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Ok", {duration: 5000}).onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }
  
  login() {
    if(this.email.length > 0 && this.password.length > 0) {
      this.authService.login(this.email, this.password)
        .then(res => {
          this.openSnackBar("Login Success");
          this.router.navigate(['discover']);
          this.dialogRef.close();
        }, err => {
          this.openSnackBar("Invalid Email or Password");
          this.password = "";
        });
    }
  }
}
