import { Component, OnInit } from '@angular/core';
import { SignUpService } from 'src/app/services/sign-up.service';
import { Email } from 'src/app/classes/Email';
import { UserService } from 'src/app/services/user.service';
import { TrackService } from 'src/app/services/track.service';
import { User } from 'src/app/classes/User';
import { Track } from 'src/app/classes/Track';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.css']
})
export class ApiTestComponent implements OnInit {

  usersVisible = false;
  users: User[];
  gottenUser: User = new User("", "", "", "", "", "", [], [], [], [], [], "", "", "");
  user: User = new User("", "", "", "", "", "", [], [], [], [], [], "", "", "");
  postedUser: User = new User("", "", "", "", "", "", [], [], [], [], [], "", "", "");
  userId = "";

  tracksVisible = false;
  tracks: Track[];
  gottenTrack: Track = new Track("", "", 5, "", "", [], "", "", [], 100);
  track: Track = new Track("", "", 5, "", "", [], "", "", [], 100);
  postedTrack: Track  = new Track("", "", 5, "", "", [], "", "", [], 100);
  trackId = "";



  constructor(private signUpService: SignUpService, private userService: UserService, private trackService: TrackService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }


  openSnackBar(message: string) {
    this.snackBar.open(message, "Ok", {duration: 5000}).onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }

  // ========== USERS ========== //

  toggleUsersVisible() {
    this.usersVisible = !this.usersVisible;
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

  postUser() {
    // this.userService.createUser(this.user).then(res => {
    //   this.postedUser = res;
    //   this.openSnackBar("Successfully posted user with id " + this.postedUser._id);
    // }, err => {
    //   this.openSnackBar("Error posting user");
    // });
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

  // ========== TRACKS ========== //

  toggleTracksVisible() {
    this.tracksVisible = !this.tracksVisible;
  }

  getTracks() {
    this.trackService.getAllTracks().then(res => {
      this.tracks = res;
      this.openSnackBar("Successfully retrieved tracks");
    }, err => {
      this.openSnackBar("Error retrieving tracks");
    });
  }

  getTrackWithId() {
    this.trackService.getTrackWithId(this.trackId).then(res => {
      this.gottenTrack = res;
      this.track = this.gottenTrack;
      this.openSnackBar("Successfully retrieved track with id " + this.gottenTrack._id);
    }, err => {
      this.openSnackBar("Error retrieving track with id " + this.trackId);
    });
  }

  postTrack() {
    this.trackService.createTrack(this.track).then(res => {
      this.postedTrack = res;
      this.openSnackBar("Successfully posted track with id " + this.postedTrack._id);
    }, err => {
      this.openSnackBar("Error posting track");
    });
  }

  putTrack() {
    this.trackService.updateTrack(this.track).then(res => {
      this.postedTrack = res;
      this.openSnackBar("Successfully updated track with id " + this.postedTrack._id);
    }, err => {
      this.openSnackBar("Error updating track");
    });
  }

  deleteTrackWithId(id: string) {
    this.trackService.deleteTrack(id).then(res => {
      console.log(res);
      this.tracks = this.tracks.filter(t => t._id !== id);
      this.openSnackBar("Successfully deleted track with id " + id);
    }, err => {
      this.openSnackBar("Error deleting track");
    });
  }

}
