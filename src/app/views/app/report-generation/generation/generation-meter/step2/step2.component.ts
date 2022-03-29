import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BsLocaleService} from 'ngx-bootstrap';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {frLocale} from 'ngx-bootstrap/locale';
import {templateJitUrl} from '@angular/compiler';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html'
})
export class Step2Component implements OnInit {

  stateButtonCurrentState = '';
  stateButtonShowMessage = false;
  stateButtonMessage = '';
  stateButtonDisabled = false;
  // value or date
  public value = true;
  public date = false;
  public time = false;

  // DatePicker + timePicker
  form: FormGroup;
  bsValue = new Date();
  bsRangeValue: Date[];
  public bsRangeValues: [Date[]];
  maxDate = new Date();
  mouseTime = new Date();
  public mouseTimes: [Date[]];
  bsInlineValue = new Date();

  // Select list
  public fieldList = [
    {id: 0, name: 'status'},
    {id: 1, name: 'pre_active_meter_date'},
    {id: 2, name: 'meter_active_date'},
    {id: 3, name: 'version'},
    {id: 4, name: 'meter_discovered'},
    {id: 5, name: 'meter_type'},
    {id: 6, name: 'meter_status'},
    {id: 7, name: 'is_installed'},
    {id: 8, name: 'installation_date'},
    {id: 9, name: 'manufactory_year'},
    {id: 10, name: 'in_service'},
    {id: 11, name: 'meter_region'},
  ];
  public operatorList = [
    {id: 0, name: 'is'},
    {id: 1, name: 'is not'},
    {id: 2, name: 'is one of'},
    {id: 3, name: 'is not one of'},
    {id: 4, name: 'is between'},
    {id: 5, name: 'is not between'},
    {id: 6, name: 'exists'},
    {id: 7, name: 'does not exist'}
  ];
  public valueList = [
    {id: 0, name: 'true'},
    {id: 1, name: 'false'}
  ];

  selectedFieldIds = [0];
  selectedOperatorIds = [0];
  selectedValueIds = [0];

  // ngSelect fields
  public fieldsLists = [];
  public operatorsLists = [];
  public valuesLists = [];

  // operators accordion
  // always id =operatorNumber-1
  public groups = [
    {
      id: 0,
      title: 'Filter - 1'
    },
  ];

  public filterNumber = 1;

  addGroupItem(): void {
    this.groups.push({
      id: this.groups.length,
      title: `Filter - ${this.filterNumber + 1}`
    });
    this.filterNumber++;
    this.fieldsLists.push(this.fieldList);
    this.operatorsLists.push(this.operatorList);
    this.valuesLists.push(this.valueList);
    this.bsRangeValues.push(this.bsRangeValue);
    // @ts-ignore
    this.mouseTimes.push(this.mouseTime);
    this.selectedFieldIds.push(0);
    this.selectedOperatorIds.push(0);
    this.selectedValueIds.push(0);
  }

  lastElement(id: number): boolean {
    return id === this.groups[this.groups.length - 1].id;
  }

  deleteGroupItem(id: number): void {
    this.groups.splice(id, 1);
    this.fieldsLists.splice(id, 1);
    this.operatorsLists.splice(id, 1);
    this.valuesLists.splice(id, 1);
    this.bsRangeValues.splice(id, 1);
    this.mouseTimes.splice(id, 1);
    this.selectedFieldIds.splice(id, 1);
    this.selectedOperatorIds.splice(id, 1);
    this.selectedValueIds.splice(id, 1);
  }

  deleteGroup(): void {
    this.groups = [];
  }

  emptyGroup(): boolean {
    if (this.groups.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  constructor(private localeService: BsLocaleService) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.bsRangeValues = [this.bsRangeValue];
    // @ts-ignore
    this.mouseTimes = [this.mouseTime];
    defineLocale('fr', frLocale);
    this.localeService.use('fr');
  }

  ngOnInit(): void {
    this.fieldsLists.push(this.fieldList);
    this.operatorsLists.push(this.operatorList);
    this.valuesLists.push(this.valueList);
    this.form = new FormGroup({
      basicDate: new FormControl(new Date()),
    });
  }

  // on change item from list
  change($event: MouseEvent, id: number) {
    console.log('changed!', this.fieldList[id]);
    if (this.fieldList[id].name === 'in_service') {
      this.value = true;
      this.date = false;
    } else if (this.fieldList[id].name === 'meter_active_date') {
      this.value = false;
      this.date = true;
    }
  }

  onStateButtonClick(event) {
    if (this.stateButtonDisabled) {
      return;
    }
    this.stateButtonDisabled = true;
    this.stateButtonCurrentState = 'show-spinner';
    // this.SearchKeyUp(event);
    setTimeout(() => {
      this.stateButtonCurrentState = 'show-success';
      setTimeout(() => {
        this.stateButtonCurrentState = '';
        this.stateButtonShowMessage = false;
        this.stateButtonDisabled = false;
      }, 2000);
    }, 1000);
  }
}
