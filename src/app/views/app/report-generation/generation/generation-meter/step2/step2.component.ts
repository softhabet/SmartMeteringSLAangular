import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html'
})
export class Step2Component implements OnInit {

  // filters accordion
  groups = [
    {
      title: 'Group Header - 1',
      content: 'Dynamic group body text - 1'
    },
  ];

  addGroupItem(): void {
    this.groups.push({
      title: `Group Header - ${this.groups.length + 1}`,
      content: `Dynamic group body text - ${this.groups.length + 1}`
    });
  }

  DeleteGroupItem(): void {
    this.groups.push({
      title: `Group Header - ${this.groups.length + 1}`,
      content: `Dynamic group body text - ${this.groups.length + 1}`
    });
  }

  // Select fiels
  public fieldList = [
      { 'id': 1, 'name': 'status' },
      { 'id': 2, 'name': 'pre_active_meter_date' },
      { 'id': 3, 'name': 'meter_active_date' },
      { 'id': 4, 'name': 'version' },
      { 'id': 5, 'name': 'meter_discovered' },
      { 'id': 6, 'name': 'meter_type' }
  ];
  selectedFieldId = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
