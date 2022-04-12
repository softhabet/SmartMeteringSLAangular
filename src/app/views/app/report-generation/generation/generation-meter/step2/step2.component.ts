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

  // save filter button
  stateButtonCurrentState = '';
  stateButtonShowMessage = false;
  stateButtonMessage = '';
  stateButtonDisabled = false;

  // show time
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

  // get criteriaSet
  getData() {
    this.reportService.getCriteriaSet(1).subscribe(
      (res) => {
        this.criteriaSet = res;
        this.filters.push({
          fieldName: this.criteriaSet[0].fieldName,
          operator: this.criteriaSet[0].operators[0].operator,
          filterValue: this.criteriaSet[0].values[0].value,
          filterType: 'listOne'
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addFilter(set): void {
    this.filters.push({
      fieldName: set[0].fieldName,
      operator: set[0].operators[0].operator,
      filterValue: set[0].values[0].value,
      filterType: 'listOne'
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
      filter.fieldName = field;
      const list = set.find((crit: any) => crit.fieldName === field);
      filter.operator = list.operators[0].operator;
      if ( list.values.length === 0) {
        if (field === 'dc_number' || field === 'meter_name') {
          filter.filterType = 'string';
          filter.filterValue = '';
        } else {
          filter.filterType = 'date';
          filter.filterValue = '';
        }
      } else {
        filter.filterType = 'listOne';
        filter.filterValue = list.values[0].value;
      }
    }
   }

  changeOperator(operator, filter) {
    filter.operator = operator;
    if (filter.filterType !== 'string') {
      if (operator === 'is between' || operator === 'is not between') {
        filter.filterType = 'dateRange';
      } else if (operator === 'is one of' || operator === 'is not one of') {
        filter.filterType = 'listMulti';
        filter.filterValue = [];
      } else {
        if (filter.filterType === 'date' || filter.filterType === 'dateRange') {
          filter.filterType = 'date';
        } else {
          filter.filterType = 'listOne';
        }
      }
    }
  }

  changeValue(value, filter) {
    filter.filterValue = value;
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

  // return
  getFilters() {
    this.filters.map((filter) => {
      if (filter.filterType === 'date') {
        filter.filterValue = this.getDateNoTime(filter.filterValue);
      } else if (filter.filterType === 'dateRange') {
        filter.filterValue[0] = this.getDateNoTime(filter.filterValue[0]);
        filter.filterValue[1] = this.getDateNoTime(filter.filterValue[1]);
      }
    });
    return this.filters;
  }

  getDateNoTime(date) {
    const timePortion = (date.getTime() - date.getTimezoneOffset() * 60 * 1000) % (3600 * 1000 * 24);
    return (new Date(date - timePortion));
  }

  onStateButtonClick(event) {
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
      }, 500);
    }, 1000);
  }
}
