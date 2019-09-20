import { Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { User } from 'src/app/classes/User';
import { UserService } from 'src/app/services/user.service';
import { TrackService } from 'src/app/services/track.service';
import { Track } from 'src/app/classes/Track';

@Component({
  selector: 'app-connect-popup',
  templateUrl: './connect-popup.component.html',
  styleUrls: ['./connect-popup.component.css']
})
export class ConnectPopupComponent implements OnInit {

  // ng servetoggle = false;
  user: User;

  followed = false;

  track: Track;

  everythingLoaded = false;

  constructor( public dialogRef: MatDialogRef<ConnectPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private trackService: TrackService) {
      console.log("DATA: " + data.track_id);
      this.trackService.getTrackWithId(data.track_id).then(res => {
        this.track = res;
        console.log("AuthID: " + this.track.primaryAuthorId);
        this.userService.getUserWithId(this.track.primaryAuthorId).then(r => {
          this.user = r;
          this.everythingLoaded = true;
          this.userService.getSignedInUser().then(user => {
            this.followed = user.followingIds.includes(this.user._id);
          });
        });
      });
  }


  ngOnInit() {

  }
  closeDialog() {
    this.dialogRef.close();
  }

  follow() {
    this.userService.getSignedInUser().then(user => {
      user.followingIds.push(this.user._id);
      this.userService.updateUser(user).then(res => {
        this.followed = true;
      });
    });
  }

  unFollow() {
    this.userService.getSignedInUser().then(user => {
      user.followingIds = user.followingIds.filter(u => u !== this.user._id);
      this.userService.updateUser(user).then(res => {
        this.followed = false;
      });
    });
  }

}
