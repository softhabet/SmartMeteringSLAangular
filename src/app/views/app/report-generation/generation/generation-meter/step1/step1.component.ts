import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html'
})
export class Step1Component implements OnInit {

  constructor() {
  }

  public simpleList = [
    [
      {name: 'status'},
      {name: 'pre_active_meter_date'},
      {name: 'meter_active_date'},
      {name: 'version'},
      {name: 'meter_discovered'},
      {name: 'meter_type'}
    ],
    [
      {name: 'dc_number'}
    ]
  ];

  public fieldList = [
    {id: 1, name: 'status'},
    {id: 2, name: 'pre_active_meter_date'},
    {id: 3, name: 'meter_active_date'},
    {id: 4, name: 'version'},
    {id: 5, name: 'meter_discovered'},
    {id: 6, name: 'meter_type'}
  ];

  selectedFieldId = 1;

  ngOnInit(): void {
  }

  public removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

}
