import { Component, OnInit, Input, Inject } from '@angular/core';
import { Track } from 'src/app/classes/Track';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ConnectPopupComponent } from '../connect-popup/connect-popup.component';
import { TrackService } from 'src/app/services/track.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/User';
import { SearchService } from 'src/app/services/search.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  toggleLike = false;
  toggle = false;
  popup = false;
  userLoaded = false;
  elapsed = "";
  duration = "";
  position = 0;
  followed = false;

  audio = new Audio();

  waves = [];


  @Input()
  track: Track;

  date: Date;

  user: User;

  trackPlayed = false;

  constructor(public dialog: MatDialog, private trackService: TrackService, private userService: UserService, private searchService: SearchService, private router: Router) { }

  ngOnInit() {
    // console.log(this.track);
    this.userService.getUserWithId(this.track.primaryAuthorId).then(res => {
      this.user = res;
      //  console.log(this.user);
      this.userLoaded = true;
      this.userService.getSignedInUser().then(user => {
        this.followed = user.followingIds.includes(this.user._id);
      });
    }, err => {
      console.log("Error fetching user for track");
    });
    this.audio.src = this.trackService.audioUrl + "/" + this.track.contentLink;
    this.audio.load();
    this.elapsed = this.formatTime(this.audio.currentTime);
    this.duration = this.formatTime(this.audio.duration);
    this.audio.ontimeupdate = this.handleTimeUpdate.bind(this);
    this.track.lengthInSeconds = this.audio.duration;

    this.date = new Date(this.track.datePosted); // new Date('2019-04-22T00:38:54.243Z');
   
    // this.date.get
  
  }

  toggleTrack() {
    this.toggle = !this.toggle;
    if (this.toggle) {
      if (!this.trackPlayed) {
        this.track.views++;
        this.trackService.updateTrack(this.track);
        this.trackPlayed = true;
      }
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  formatTime(seconds) {
    if(isNaN(seconds)) {
      return "00:00";
    }
    let minutes:any = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  }

  handleTimeUpdate(e) {
    const elapsed = this.audio.currentTime;
    const duration = this.audio.duration;
    this.position = elapsed / duration;
    this.elapsed = this.formatTime(elapsed);
    this.duration = this.formatTime(duration);
  }

  likeTrack() {
    this.toggleLike = !this.toggleLike;
    if (this.toggleLike) {
      this.user.likedTrackIds.push(this.track._id);
      this.userService.updateUser(this.user);
    } else {
      this.user.likedTrackIds = this.user.likedTrackIds.filter(t => t !== this.track._id);
      this.userService.updateUser(this.user);
    }
  }


  // followUser() {
  //   let currUser: User;
  //   this.userService.getSignedInUser().then(res => {
  //     currUser = res;
  //     this.userLoaded = true;

  //       if (!currUser.followingIds.includes(this.track.primaryAuthorId)) {
  //         currUser.followingIds.push(this.track.primaryAuthorId);
  //         this.userService.updateUser(currUser);
  //         this.following = true;
  //       // }
  //     } else {
  //       alert("here");
  //       currUser.followingIds = currUser.followingIds.filter(t => t !== this.track.primaryAuthorId);
  //       this.userService.updateUser(currUser);
  //       this.following = false;
  //     }
  //     }, err => {
  //     console.log("Error getting signed in user");
  //   });

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

    visitUser() {
      this.userService.userBeingVisited = this.user;
      if (this.user._id === this.userService.signedInUser) {
        return;
      }
      this.router.navigate(['/other-user-profile']);
    }
  


  // when connect popup is implemented this function is called to open the dialog. 
  openDialog() {
    const dialogRef = this.dialog.open(ConnectPopupComponent, {
      width: '500px',
      height: '420px',
      data: {id: this.track.primaryAuthorId,
          track_id: this.track._id},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  getElapsed() {
    if (!this.trackPlayed) {
      return 0;
    }
    return Math.floor((this.audio.currentTime / this.audio.duration) * 100);
  }

  getRemaining() {
    if (!this.trackPlayed) {
      return 100;
    }
    return Math.floor((1 - this.audio.currentTime / this.audio.duration) * 100);
  }

}
