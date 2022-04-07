import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BsLocaleService} from 'ngx-bootstrap';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {frLocale} from 'ngx-bootstrap/locale';
import {templateJitUrl} from '@angular/compiler';
import { th, tr } from 'date-fns/locale';
import { ReportService} from 'src/app/services/report.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html'
})
export class Step2Component implements OnInit {

  stateButtonCurrentState = '';
  stateButtonShowMessage = false;
  stateButtonMessage = '';
  stateButtonDisabled = false;

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

  // operators accordion
  // always id =operatorNumber-1
  public filters = [];

  criteriaSet = [];


  constructor(private localeService: BsLocaleService, private reportService: ReportService) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.bsRangeValues = [this.bsRangeValue];
    // @ts-ignore
    this.mouseTimes = [this.mouseTime];
    defineLocale('fr', frLocale);
    this.localeService.use('fr');
  }

  ngOnInit(): void {
    this.getData();
    this.form = new FormGroup({
      basicDate: new FormControl(new Date()),
    });
  }

  createFilters() {
    this.getData();
  }

  getData() {
    this.reportService.getCriteriaSet(1).subscribe(
      (res) => {
        console.log(res);
        this.criteriaSet = res;
        this.filters.push({
          field: this.criteriaSet[0].fieldName,
          operator: this.criteriaSet[0].operators[0].operator,
          value: this.criteriaSet[0].values[0].value,
          valueType: 'listOne'
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }


  addFilter(set): void {
    this.filters.push({
      field: set[0].fieldName,
      operator: set[0].operators[0].operator,
      value: set[0].values[0].value,
      valueType: 'listOne'
    });
    this.bsRangeValues.push(this.bsRangeValue);
    // @ts-ignore
    this.mouseTimes.push(this.mouseTime);
  }

  deleteFilter(filter) {
    this.filters.splice(this.filters.indexOf(filter), 1);
  }

  getOperators(set, fieldName) {
    if (fieldName !== null) {
      return set.find((crit: any) => crit.fieldName === fieldName).operators;
    }
  }

  getValues(set, fieldName) {
    if (fieldName !== null) {
    return set.find((crit: any) => crit.fieldName === fieldName).values;
  }
  }

  lastElement(filter) {
    return filter === this.filters[this.filters.length - 1];
  }

  // on change item from list
  changeField(field, filter, set) {
    if (field !== null) {
      filter.field = field;
      const list = set.find((crit: any) => crit.fieldName === field);
      filter.operator = list.operators[0].operator;
      if ( list.values.length === 0) {
        if (field === 'dc_number' || field === 'meter_name') {
          filter.valueType = 'string';
          filter.value = '';
        } else {
          filter.valueType = 'date';
          filter.value = '';
        }
      } else {
        filter.valueType = 'listOne';
        filter.value = list.values[0].value;
      }
    }
   }

  changeOperator(operator, filter) {
    filter.operator = operator;
    if (filter.valueType !== 'string') {
      if (operator === 'is between' || operator === 'is not between') {
        filter.valueType = 'dateRange';
      } else if (operator === 'is one of' || operator === 'is not one of') {
        filter.valueType = 'listMulti';
        filter.value = [];
      } else {
        if (filter.valueType === 'date' || filter.valueType === 'dateRange') {
          filter.valueType = 'date';
        } else {
          filter.valueType = 'listOne';
        }
      }
    }
  }

  changeValue(value, filter) {
    filter.value = value;
  }

  deleteGroupItem(id: number): void {
    this.filters.splice(id, 1);
    this.bsRangeValues.splice(id, 1);
    this.mouseTimes.splice(id, 1);
  }

  deleteFilters(): void {
    this.filters = [];
  }

  checkEmpty(): boolean {
    return this.filters.length === 0;
  }

  getFilters() {
    console.log(this.filters);
    return this.filters;
  }

  onStateButtonClick(event) {
    if (this.stateButtonDisabled) {
      return;
    }
    this.stateButtonDisabled = true;
    this.stateButtonCurrentState = 'show-spinner';
    console.log(this.filters);
    setTimeout(() => {
      this.stateButtonCurrentState = 'show-success';
      setTimeout(() => {
        this.stateButtonCurrentState = '';
        this.stateButtonShowMessage = false;
        this.stateButtonDisabled = false;
      }, 500);
    }, 1000);
  }
}
