import { Injectable } from '@angular/core';
import { Track } from '../classes/Track';
import { Http } from '@angular/http';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class TrackService {


  private tracks: Track[];
  private tracksUrl = AppComponent.MONGO_DEBUG ? "http://localhost:8080/api/tracks" : "/api/tracks";
  public audioUrl = AppComponent.MONGO_DEBUG ? "http://localhost:8080/api/audio" : "/api/audio";


  constructor(private http: Http) { }

  // Gets all tracks from db
  getAllTracks(): Promise<Track[]> {
    return this.http.get(this.tracksUrl)
      .toPromise()
      .then(response => response.json().map(r => Track.fromJSON(r),
      err => this.handleError(err)));
  }

  // Gets all tracks from db for a specific user
  getAllTracksForUserId(userId: String): Promise<Track[]> {
    return this.http.get(this.tracksUrl)
      .toPromise()
      .then(response => response.json().map(r => Track.fromJSON(r)).filter(t => t.primaryAuthorId === userId),
      err => this.handleError(err));
  }

  // Get track from db
  getTrackWithId(trackId: String): Promise<Track> {
    return this.http.get(this.tracksUrl + '/' + trackId)
      .toPromise()
      .then(response => Track.fromJSON(response.json()));
  }

  // Post track to db
  createTrack(newTrack: Track): Promise<Track> {
    return this.http.post(this.tracksUrl, newTrack.getJSON())
      .toPromise()
      .then(response => Track.fromJSON(response.json()));
  }

  postTrackFile(file: File): Promise<any> {
    console.log(file);
    let formData = new FormData();
    formData.append('audioFile', file, file.name);
    return this.http.post(this.audioUrl, formData).toPromise().then(res => res);
  }

  // Remove track from db
  deleteTrack(trackId: String): Promise<String> {
    return this.http.delete(this.tracksUrl + '/' + trackId)
      .toPromise()
      .then(response => response.json() as String);
  }

  // Update a track in db
  updateTrack(track: Track): Promise<Track> {
    let putTrackUrl = this.tracksUrl + '/' + track._id;
    return this.http.put(putTrackUrl, track.getJSON())
      .toPromise()
      .then(response => Track.fromJSON(response.json()));
  }

  public handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
  }
}
