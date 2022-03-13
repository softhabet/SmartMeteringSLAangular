import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsLocaleService} from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html'
})
export class Step2Component implements OnInit {

  // filters accordion
  public groups = [
    {
      id: 1,
      title: 'Filter - 1'
    },
  ];

  public groupsLength : number = 1;

  addGroupItem(): void {
    this.groups.push({
      id: this.groupsLength + 1,
      title: `Filter - ${this.groupsLength + 1}`
    });
    this.groupsLength++;
  }

  deleteGroupItem(id : number): void {
    this.groups.forEach((value,index)=>{
      if(value.id==id) this.groups.splice(index,1);
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
  public filterList = [
    { 'id': 1, 'name': 'status' },
    { 'id': 2, 'name': 'pre_active_meter_date' },
    { 'id': 3, 'name': 'meter_active_date' },
    { 'id': 4, 'name': 'version' },
    { 'id': 5, 'name': 'meter_discovered' },
    { 'id': 6, 'name': 'meter_type' }
];
public valueList = [
  { 'id': 1, 'name': 'equals' },
  { 'id': 2, 'name': 'grater then' },
  { 'id': 3, 'name': 'less then' },
  { 'id': 4, 'name': 'not equal' },
];
  selectedFieldId = 1;
  selectedFilterId = 1;
  selectedValueId = 1;

  // value or date
  public value : boolean = false;
  public date : boolean = true;

  // DatePicker + timePicker
  form: FormGroup;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  mouseTime = new Date();

  bsInlineValue = new Date();


  constructor(private localeService: BsLocaleService) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];

    defineLocale('es', esLocale);
    // this.localeService.use('es');
   }

  ngOnInit(): void {
    this.form = new FormGroup({
      basicDate: new FormControl(new Date()),
    });
  }

}
