import { Component, OnInit } from '@angular/core';
import { TrackService } from 'src/app/services/track.service';
import { Track } from 'src/app/classes/Track';
import { User } from 'src/app/classes/User';
import { UserService } from 'src/app/services/user.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {

  tracksOnPage: Track[] = [];
  dropdownOpened = false;
  filterOptions = ["Oldest", "Newest", "Most Played"];
  filterBy = "Newest";
  sidePanelVisible = true;

  constructor(private trackService: TrackService, private userService: UserService, private searchService: SearchService) {

  }

  ngOnInit() {
    this.trackService.getAllTracks().then(res => {
      this.tracksOnPage = res;
      this.tracksOnPage = this.tracksOnPage.sort((a, b) => (new Date(b.datePosted)).getTime() - (new Date(a.datePosted)).getTime());

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
