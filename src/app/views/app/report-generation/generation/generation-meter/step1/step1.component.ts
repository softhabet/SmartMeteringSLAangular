import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html'
})
export class Step1Component implements OnInit {

  constructor() { }

  public simpleList = [
    [
      { 'name': 'status' },
      { 'name': 'pre_active_meter_date' },
      { 'name': 'meter_active_date' },
      { 'name': 'version' },
      { 'name': 'meter_discovered' },
      { 'name': 'meter_type' }
    ],
    [
      { 'name': 'dc_number' }
    ]
  ];

  ngOnInit(): void {
  }

  public removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

}
