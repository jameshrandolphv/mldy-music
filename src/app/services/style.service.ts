import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  components = ["discover", "profile"];
  selectedComponent: string = this.components[0];

  constructor() { }
}
