import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { User } from 'src/app/classes/User';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material';
import { TrackService } from 'src/app/services/track.service';
import { AdminComponent } from '../admin/admin.component';


/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  
  @Input() input: any[];
  displayedColumns: string[] = [];
  dataSource: any[] = [];

  constructor(private userService: UserService, private trackService: TrackService, private snackBar: MatSnackBar) { }

  // Given an input array of type T, populates dataSource table with json 
  // object of input element properties to be formatted into table.
  toTable<T>() {
    this.displayedColumns = [];
    if(this.input.length > 0) {
      Object.getOwnPropertyNames(this.input[0]).map((prop) => {
        if(this.input[0][prop]) {
          if(this.input[0][prop].length > 0 && prop !== "salt" && prop !== "hash"){
            this.displayedColumns.push(prop);
          }
        }
      });
  
      this.dataSource = [];
      let index = 0;
      this.input.map((e) => {
        let entry = {};
        this.displayedColumns.map((prop) => {
          entry[prop] = e[prop];
        });
        this.dataSource[index] = entry;
        index++;
      }); 
    }
    console.log(this.input)
  }

  ngOnInit() {
    this.toTable();
    // this.toTable(this.parent.getRequest());
  }

  // openSnackBar(message: string) {
  //   this.snackBar.open(message, "Ok", {duration: 5000}).onAction().subscribe(() => {
  //     this.snackBar.dismiss();
  //   });
  // }

  // getAllUsers() {
  //   this.userService.getAllUsers().then(res => {
  //     this.toTable(res);
  //     this.openSnackBar("Successfully retrieved users");
  //   }, err => {
  //     this.openSnackBar("Error retrieving users");
  //   });
  // }

  // getAllTracks() {
  //   this.trackService.getAllTracks().then(res => {
  //     this.toTable(res);
  //     this.openSnackBar("Successfully retrieved tracks");
  //   }, err => {
  //     this.openSnackBar("Error retrieving tracks");
  //   });
  // }

}