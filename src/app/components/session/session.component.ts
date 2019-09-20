import { Component, OnInit } from '@angular/core';
import { Session } from 'src/app/classes/Session';
import { SessionService } from 'src/app/services/session.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  sessions: Session[] = [];
  constructor(private sessionService: SessionService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.sessionService.getAllSessions().then(res => {
      this.sessions = res;
      this.sessionService.initLocations(this.sessions);
    })
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Ok", {duration: 5000}).onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }

  deleteSession(ip: string) {
    this.sessionService.deleteSession(ip).then(res => {
      this.sessions = this.sessions.filter(s => s.ip !== ip);
      this.openSnackBar("Session removed.");
    })
  }

}
