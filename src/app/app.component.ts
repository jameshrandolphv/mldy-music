import { Component } from '@angular/core';
import { Track } from './classes/Track';
import { TrackComponent } from './components/track/track.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public static MONGO_DEBUG = false;

  title = 'mldy-music';

}