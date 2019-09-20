import { Component, OnInit, Input } from '@angular/core';
import { ContactCard } from '../../classes/ContactCard';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent implements OnInit {

  @Input()
  contact: ContactCard;

  constructor() { }

  ngOnInit() {
  }

}
