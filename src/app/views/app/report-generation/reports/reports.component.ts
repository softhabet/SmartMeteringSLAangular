import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {

  @Output() searchKeyUp: EventEmitter<any> = new EventEmitter();

  stateButtonCurrentState = '';
  stateButtonShowMessage = false;
  stateButtonMessage = '';
  stateButtonDisabled = false;

  @ViewChild('search') search: any;
  constructor() { }

  ngOnInit(): void {
  }

  onStateButtonClick() {
    if (this.stateButtonDisabled) {
      return;
    }
    this.stateButtonDisabled = true;
    this.stateButtonCurrentState = 'show-spinner';
    setTimeout(() => {
      this.stateButtonCurrentState = 'show-success';
      setTimeout(() => {
        this.stateButtonCurrentState = '';
        this.stateButtonShowMessage = false;
        this.stateButtonDisabled = false;
      }, 2000);
    }, 1000);
  }

  onSearchKeyUp($event){
    this.searchKeyUp.emit($event);
  }

}
