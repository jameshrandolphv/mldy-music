import { Component, OnInit, Input, Inject } from '@angular/core';
import { User } from 'src/app/classes/User';
import {MAT_DIALOG_DATA} from '@angular/material'

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  
  constructor(@Inject(MAT_DIALOG_DATA) public user: User) { }

  ngOnInit() {
  }

}
