import { Component, OnInit, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { User } from 'src/app/classes/User';
import { UserService } from 'src/app/services/user.service';
import { TrackService } from 'src/app/services/track.service';
import { Track } from 'src/app/classes/Track';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;

  tracks: Track[];

  everythingLoaded = false;
  editing = false;

  constructor(private userService: UserService, private trackService: TrackService, private dialog: MatDialog) {
    this.userService.getSignedInUser().then(res => {
      this.user = res;
      this.trackService.getAllTracksForUserId(this.user._id).then(
        t => {
          this.tracks = t;
          this.everythingLoaded = true;
        }
      );
    });
    
    
  }

  putUser() {
    this.userService.updateUser(this.user).then(res => {
      this.user = res;
      // this.openSnackBar("Changes successfully saved.");
    });
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '800px',
      height: '620px',
      data: this.user,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    
  }

  ngOnInit() {
  }
}
