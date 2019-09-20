import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ContactCard } from 'src/app/classes/ContactCard';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {

  contacts: ContactCard[];

  constructor(private chatService: ChatService) {
    this.contacts = this.chatService.getChatContacts();
  }

  ngOnInit() {
  }

}
