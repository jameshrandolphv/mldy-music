import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/classes/Track';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBarRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TrackService } from 'src/app/services/track.service';
import { User } from 'src/app/classes/User';

@Component({
  selector: 'app-upload-track',
  templateUrl: './upload-track.component.html',
  styleUrls: ['./upload-track.component.css']
})
export class UploadTrackComponent implements OnInit {

  track: Track = new Track("", "", undefined, "", "", [], "", "", [], undefined);
  user: User = new User("", "", "", "", "", "", [], [], [], [], [], "", "", "");
  postedTrack: Track = new Track("", "", undefined, "", "", [], "", "", [], undefined);
  trackId = "";
  tags = "";


  constructor(private userService: UserService, private trackService: TrackService,
    private snackBar: MatSnackBar, private router: Router) { 
      
    }

  ngOnInit() {
    this.userService.getSignedInUser().then(res => {
      this.user = res;
      this.track.primaryAuthorId = this.user._id;
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Ok", {duration: 5000}).onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }

  postTrackWithId() {
    if (this.track.title.length < 1) {
      this.openSnackBar("Must provide track title");
      return;
    }
    if (this.tags.length < 1) {
      this.openSnackBar("Must provide tag(s)");
      return;
    }
    this.track.tags = this.tags.split(",");
    this.track.views = 0;
    this.track.lengthInSeconds = 0;
    let f = (document.getElementById("audio-file") as HTMLFormElement).files[0];
    let file = f as File;
    this.track.filetype = file.type;
    this.track.primaryAuthorId = this.user._id;
    this.track.contentLink = file.name;

    // console.log(this.tags);
    // console.log(this.track);

    this.trackService.postTrackFile(f).then(result => {
      // console.log("Result of posting track: ");
      // console.log(result);
      this.trackService.createTrack(this.track).then(res => {
        this.postedTrack = res;
        this.openSnackBar("Successfully posted track!");
        this.router.navigate(["profile"]);
      }, err => {
        this.openSnackBar("Error posting track");
      });
    });
  }

  cancelUpload() {
    this.openSnackBar("Canceling will delete any changes.");
    return;
  }

  validateEmail() {

    let isemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return isemail.test(this.user.email);
  }

  dropHandler(event) {
    console.log("File dropped.");
  }

  dragOverHandler(event) {
    console.log("File in drop zone.");
    event.preventDefault();
  }

}
