import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/User';
import { MatSnackBar, MatSnackBarConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RouterLink, Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  users: User[];
  gottenUser: User = new User("", "", "", "", "", "", [], [], [], [], [], "", "", "");
  user: User = new User("", "", "", "", "", "", [], [], [], [], [], "", "", "");
  postedUser: User = new User("", "", "", "", "", "", [], [], [], [], [], "", "", "");
  userId = "";
  toggle = false;

  betaKey = "";

  password = "";
  confirmPassword = "";

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService, private authService: AuthService, private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit() {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Ok", {duration: 5000}).onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }

  getUsers() {
    this.userService.getAllUsers().then(res => {
      this.users = res;
      this.openSnackBar("Successfully retrieved users");
    }, err => {
      this.openSnackBar("Error retrieving users");
    });
  }

  getUserWithId() {
    this.userService.getUserWithId(this.userId).then(res => {
      this.gottenUser = res;
      this.user = this.gottenUser;
      this.openSnackBar("Successfully retrieved user with id " + this.gottenUser._id);
    }, err => {
      this.openSnackBar("Error retrieving user with id " + this.userId);
    });
  }
  
  
  setPassword = function(password) {
  };

  postUser() {
    if (this.user.firstName.length < 1) {
      this.openSnackBar("Must provide a first name");
      return;
    }
    if (this.user.lastName.length < 1) {
      this.openSnackBar("Must provide a last name");
      return;
    }
    if (!this.validateEmail()) {
      this.openSnackBar("Invalid email");
      return;
    }
    if (this.user.primaryRole.length < 1) {
      this.openSnackBar("Must provide a primary role");
      return;
    }
    if (!(this.betaKey === "MLDY-BETA-TESTER")) {
      this.openSnackBar("Incorrect beta key");
      return;
    }
    if (!(this.password === this.confirmPassword)) {
      this.openSnackBar("Passwords do not match");
      return;
    }

    this.userService.createUser(this.user, this.password).then(res => {
      this.postedUser = res;
      this.openSnackBar("Successfully created account!");
      this.userService.signedInUser = this.postedUser;
      this.closeDialog();
      return true;
    }, err => {
      if(err.status === 409) {
        this.openSnackBar("Account with that email already exists");
      } else {
        this.openSnackBar("Error creating account");
      }
      return false;
    }).then(res => {
      if(res) {
        this.authService.login(this.user.email, this.password)
        .then(res => {
          this.router.navigate(['discover']);
          this.dialogRef.close();
        }, err => {
          this.openSnackBar("Invalid Email or Password");
          this.password = "";
        });
      }
    });

    
  }

  putUser() {
    this.userService.updateUser(this.user).then(res => {
      this.postedUser = res;
      this.openSnackBar("Successfully updated user with id " + this.postedUser._id);
    }, err => {
      this.openSnackBar("Error updating user");
    });
  }

  deleteUserWithId(id: string) {
    this.userService.deleteUser(id).then(res => {
      this.users = this.users.filter(u => u._id !== id);
      this.openSnackBar("Successfully deleted user with id " + id);
    }, err => {
      this.openSnackBar("Error deleting user");
    });
  }

  validateEmail() {

    let isemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return isemail.test(this.user.email);
  }

  checkValid(): boolean {
   // let isemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (this.user.firstName.length < 1) {
        this.openSnackBar("Must provide a first name");
        return false;
      }
      if (this.user.lastName.length < 1) {
        this.openSnackBar("Must provide a last name");
        return false;
      }
      if (!this.validateEmail()) {
        this.openSnackBar("Invalid email");
        return false;
      }
      this.toggle = !this.toggle;
      return true;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
