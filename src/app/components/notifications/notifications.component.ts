import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor( private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Ok", {duration: 5000}).onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }
  noNoti() {
      this.openSnackBar("No Notifications");
    }

}
