import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  isfiltered: boolean = false;

  filterUSDT() {

    this.isfiltered = !this.isfiltered;
  }
}
