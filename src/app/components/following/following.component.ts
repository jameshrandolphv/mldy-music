import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/classes/Track';
import { TrackService } from 'src/app/services/track.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  tracksOnPage: Track[] = [];
  dropdownOpened = false;
  filterOptions = ["Oldest", "Newest", "Most Played", "Most Similar"];
  filterBy = "Newest";
  sidePanelVisible = true;

  constructor(private trackService: TrackService, private userService: UserService) {

  }

  ngOnInit() {
    this.trackService.getAllTracks().then(res => {
      this.userService.getSignedInUser().then(
        user => {
          this.tracksOnPage = res.filter(t => user.followingIds.includes(t.primaryAuthorId));
          this.tracksOnPage = this.tracksOnPage.sort((a, b) => (new Date(b.datePosted)).getTime() - (new Date(a.datePosted)).getTime());
        }
      );      
    }, err => {
      console.log("No tracks");
    });
  }

  toggleDropdown(e: MouseEvent, filterBy: string) {
    this.dropdownOpened = !this.dropdownOpened;
    this.filterBy = filterBy;
    switch (this.filterBy) {
      case "Most Played":
        this.tracksOnPage = this.tracksOnPage.sort((a, b) => b.views - a.views);
        break;
      case "Oldest":
        this.tracksOnPage = this.tracksOnPage.sort((a, b) => (new Date(a.datePosted)).getTime() - (new Date(b.datePosted)).getTime());
        break;
      case "Newest":
        this.tracksOnPage = this.tracksOnPage.sort((a, b) => (new Date(b.datePosted)).getTime() - (new Date(a.datePosted)).getTime());
        break;
      default:
    }
    e.stopPropagation();
  }

  closeDropdown(e: MouseEvent) {
    this.dropdownOpened = false;
  }

  hideSidePanel() {
    this.sidePanelVisible = false;
  }

  showSidePanel() {
    this.sidePanelVisible = true;
  }

}
