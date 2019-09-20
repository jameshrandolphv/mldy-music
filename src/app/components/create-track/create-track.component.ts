import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/classes/Track';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBarRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TrackService } from 'src/app/services/track.service';
import { User } from 'src/app/classes/User';

@Component({
  selector: 'app-create-track',
  templateUrl: './create-track.component.html',
  styleUrls: ['./create-track.component.css']
})
export class CreateTrackComponent implements OnInit {

  track: Track = new Track("", "", undefined, "", "", [], "", "", [], undefined);
  user: User = new User("", "", "", "", "", "", [], [], [], [], [], "", "", "");
  postedTrack: Track = new Track("", "", undefined, "", "", [], "", "", [], undefined);
  trackId = "";
  tags = "";

  file: File;

  betaKey = "";

  password = "";
  confirmPassword = "";

  constructor(private userService: UserService, private trackService: TrackService,
    private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.user = this.userService.signedInUser;
    this.track.primaryAuthorId = this.user !== undefined ? this.user._id : "";
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Ok", {duration: 5000}).onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }

  postTrackWithId() {
    if (this.track.title.length < 1) {
      this.openSnackBar("Must provide a track title");
      return;
    }
    this.track.tags = this.tags.split(",");
    this.track.views = 0;
    this.track.lengthInSeconds = 0;
    this.track.filetype = this.file.type;
    this.track.contentLink = ((document.getElementById("audio-file") as HTMLFormElement).files[0] as File).name;
    console.log(this.track);
    // let formData = new FormData((document.getElementById("audio-file") as HTMLFormElement));
    this.trackService.postTrackFile((document.getElementById("audio-file") as HTMLFormElement).files[0]).then(result => {
      this.trackService.createTrack(this.track).then(res => {
        this.postedTrack = res;
        this.openSnackBar("Successfully posted track!");
        this.router.navigate(["profile"]);
      }, err => {
        this.openSnackBar("Error posting track");
      });
    });
    // }, err => {
    //   // Error???
    //   this.trackService.createTrack(this.track).then(res => {
    //     this.postedTrack = res;
    //     this.openSnackBar("Successfully posted track!");
    //     this.router.navigate(["profile"]);
    //   }, err => {
    //     this.openSnackBar("Error posting track");
    //   });
    // });

  }


  validateEmail() {

    let isemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return isemail.test(this.user.email);
  }

}
