import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html'
})
export class Step1Component implements OnInit {

  constructor() { }

  public simpleList = [
    [
      { 'name': 'John' },
      { 'name': 'Smith' },
      { 'name': 'George' },
    ],
    [
      { 'name': 'Jennifer' },
      { 'name': 'Laura' },
      { 'name': 'Georgina' },
    ]
  ];

  ngOnInit(): void {
  }

}
