import { Injectable } from '@angular/core';
import { ContactCard } from '../classes/ContactCard';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  contacts: ContactCard[];

  constructor() {
    let c0: ContactCard = new ContactCard("Shane", "Steele-Pardue", this.isOnline(), this.hasUnread());
    let c1: ContactCard = new ContactCard("Brooke", "Canter", this.isOnline(), this.hasUnread());
    let c2: ContactCard = new ContactCard("Jay", "Randolph", this.isOnline(), this.hasUnread());
    let c3: ContactCard = new ContactCard("Shane", "Steele-Pardue", this.isOnline(), this.hasUnread());
    let c4: ContactCard = new ContactCard("Brooke", "Canter", this.isOnline(), this.hasUnread());
    let c5: ContactCard = new ContactCard("Jay", "Randolph", this.isOnline(), this.hasUnread());
    this.contacts = [c0, c1, c2, c3, c4, c5];
  }

  private isOnline(): boolean {
    return Math.random() > 0.5;
  }

  private hasUnread(): boolean {
    return Math.random() < 0.5;
  }


  public getChatContacts() {
      return this.contacts;
  }
}
