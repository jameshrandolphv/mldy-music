import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.css']
})
export class ChatPopupComponent implements OnInit {

  chatPopupExpanded = true;

  constructor() { }

  ngOnInit() {
  }

  toggleChatExpanded() {
    this.chatPopupExpanded = !this.chatPopupExpanded;
  }
  
}
