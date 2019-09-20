import { Component, OnInit, Input } from '@angular/core';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { UserService } from 'src/app/services/user.service';
import { TrackService } from 'src/app/services/track.service';
import { User } from 'src/app/classes/User';
import { Track } from 'src/app/classes/Track';

@Component({
  selector: 'app-other-user-profile',
  templateUrl: './other-user-profile.component.html',
  styleUrls: ['./other-user-profile.component.css']
})
export class OtherUserProfileComponent implements OnInit {

  user: User;

  signedInUser: User;

  tracks: Track[];

  everythingLoaded = false;
  followed = false;

  constructor(private userService: UserService, private trackService: TrackService) {
    this.userService.getSignedInUser().then(res => {
      this.user = this.userService.getUserBeingVisited();
      this.signedInUser = res;
      this.trackService.getAllTracksForUserId(this.user._id).then(
        t => {
          t = t.map(t => {t.userVisible = false; return t;});
          this.tracks = t;
          this.everythingLoaded = true;
        }
      );
    });    
    
  }

  ngOnInit() {
  }

  follow() {
    this.signedInUser.followingIds.push(this.user._id);
    this.userService.updateUser(this.signedInUser).then(res => {
      this.followed = true;
    });
  }

  unFollow() {
    this.signedInUser.followingIds = this.signedInUser.followingIds.filter(u => u !== this.user._id);
    this.userService.updateUser(this.signedInUser).then(res => {
      this.followed = false;
    });
  }

}
