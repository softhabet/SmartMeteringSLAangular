import {ChangeDetectorRef, AfterContentChecked, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {frLocale} from 'ngx-bootstrap/locale';
import { th, tr } from 'date-fns/locale';
import { ReportService, IFilter } from 'src/app/services/report.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import {timeRequired} from './../custom.validators';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html'
})
export class Step2Component implements OnInit, AfterContentChecked {

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
  mouseTime: Date = null;
  public mouseTimes1: Date[];
  public mouseTimes2: Date[];
  bsInlineValue = new Date();
  minDate = new Date();

  // operators accordion
  // always id =operatorNumber-1
  public filters = [];

  criteriaSet = [];

  constructor(private notifications: NotificationsService, private localeService: BsLocaleService, private changeDetector: ChangeDetectorRef, private reportService: ReportService) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.bsRangeValues = [this.bsRangeValue];
    this.mouseTimes1 = [this.mouseTime];
    this.mouseTimes2 = [this.mouseTime];
    defineLocale('fr', frLocale);
    this.localeService.use('fr');
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
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
      this.mouseTimes1.push(this.mouseTime);
      this.mouseTimes2.push(this.mouseTime);
  }

  getLastFilter() {
    return this.filters[this.filters.length - 1];
  }

  deleteFilter(filter) {
    this.filters.splice(this.filters.indexOf(filter), 1);
    this.bsRangeValues.splice(this.filters.indexOf(filter), 1);
    this.mouseTimes1.splice(this.filters.indexOf(filter), 1);
    this.mouseTimes2.splice(this.filters.indexOf(filter), 1);
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

  changeOperator(operator, filter, field, set) {
    filter.operator = operator;
    const list = set.find((crit: any) => crit.fieldName === field);
    if (filter.filterType !== 'string') {
      if (operator === 'is between' || operator === 'is not between') {
        filter.filterType = 'dateRange';
        filter.filterValue = [];
      } else if (operator === 'is one of' || operator === 'is not one of') {
        filter.filterType = 'listMulti';
        filter.filterValue = [list.values[0].value];
      } else {
        if (filter.filterType === 'date' || filter.filterType === 'dateRange') {
          filter.filterType = 'date';
          filter.filterValue = '';
        } else {
          filter.filterType = 'listOne';
          filter.filterValue = list.values[0].value;
        }
      }
    } else {
      filter.filterValue = '';
    }
  }

  changeValue(value, filter) {
    filter.filterValue = value;
  }

  deleteFilters(): void {
    this.filters = [];
    this.bsRangeValues = [[]];
    this.mouseTimes1 = [];
    this.mouseTimes2 = [];
  }

  // yes if array empty
  checkEmpty(): boolean {
    return this.filters.length === 0;
  }

  // return filters to wizard
  getFilters() {
    this.filters.map((filter, index) => {
      if (filter.filterType === 'date') {
        const time1 = this.mouseTimes1[index];
        if (filter.filterValue !== '' && filter.filterValue !== null && time1 == null) {
          filter.filterValue = this.getDateNoTime(filter.filterValue);
          console.log(filter.filterValue);
        } else if (filter.filterValue !== '' && filter.filterValue !== null && time1 != null) {
          filter.filterValue = this.getDatePlusTime(filter.filterValue, time1);
          console.log(filter.filterValue);
        }
      } else if (filter.filterType === 'dateRange') {
        const time1 = this.mouseTimes1[index];
        const time2 = this.mouseTimes2[index];
        if (filter.filterValue !== null && filter.filterValue.length !== 0) {
          if (time1 == null && time2 == null) {
            filter.filterValue[0] = this.getDateNoTime(filter.filterValue[0]);
            filter.filterValue[1] = this.getDateNoTime(filter.filterValue[1]);
          } else if (time1 == null && time2 != null ) {
            filter.filterValue[0] = this.getDateNoTime(filter.filterValue[0]);
            filter.filterValue[1] = this.getDatePlusTime(filter.filterValue[1], time2);
          } else if (time1 != null && time2 == null ) {
            filter.filterValue[0] = this.getDatePlusTime(filter.filterValue[0], time1);
            filter.filterValue[1] = this.getDateNoTime(filter.filterValue[1]);
          } else {
            filter.filterValue[0] = this.getDatePlusTime(filter.filterValue[0], time1);
            filter.filterValue[1] = this.getDatePlusTime(filter.filterValue[1], time2);
          }
          console.log(filter.filterValue);
        }
      }
    });
    // this.checkFilters();
    return this.getFiltersToSave(this.filters);
  }

  getFiltersToSave(filters) {
    const savedFilters: IFilter[] = [];
    filters.forEach((filter) => {
      if (filter.filterType === 'listOne') {
        savedFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: filter.filterValue,
          filterType: filter.filterType
        });
      } else if (filter.filterType === 'listMulti') {
        savedFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: this.getList(filter.filterValue),
          filterType: filter.filterType
        });
      } else if (filter.filterType === 'date') {
        savedFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: this.getTimestamp(filter.filterValue).toString(),
          filterType: filter.filterType
        });
      } else if (filter.filterType === 'dateRange') {
        const dateArray = [this.getTimestamp(filter.filterValue[0]).toString(), this.getTimestamp(filter.filterValue[1]).toString()];
        savedFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: this.getList(dateArray),
          filterType: filter.filterType
        });
      } else {
        savedFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: filter.filterValue,
          filterType: filter.filterType
        });
      }
    });
    return savedFilters;
  }

  getList(list) {
    let string = '';
    list.forEach((elem: string) => {
      string += elem + ',';
    });
    return string.slice(0, -1);
  }

  getTimestamp(date): number {
    return (new Date(date).getTime() / 1000);
  }

  getDateNoTime(date) {
    const timePortion = (date.getTime() - date.getTimezoneOffset() * 60 * 1000) % (3600 * 1000 * 24);
    return (new Date(date - timePortion));
  }

  getDatePlusTime(date, time) {
    if (date != null && time != null ) {
      return new Date(date.setHours(time.getHours(), time.getMinutes(), 0));
    }
  }

  // check if filters are valid
  checkFilters(): boolean {
    if (this.checkEmpty()) {
      this.onWarning('filtersRequiredAlert');
      return false;
    } else {
      if (this.checkDuplicateField() && this.checkEmptyFieldValue() && this.checkEmptyFieldName()) {
        this.onWarning('filterDuplicateAlert');
        this.onWarning('filterNameRequiredAlert');
        this.onWarning('filterValueRequiredAlert');
        return false;
      } else if (this.checkDuplicateField() && this.checkEmptyFieldValue()) {
        this.onWarning('filterDuplicateAlert');
        this.onWarning('filterValueRequiredAlert');
        return false;
      } else if (this.checkDuplicateField() && this.checkEmptyFieldName()) {
        this.onWarning('filterDuplicateAlert');
        this.onWarning('filterValueRequiredAlert');
        return false;
      } else if (this.checkEmptyFieldValue() && this.checkEmptyFieldName()) {
        this.onWarning('filterNameRequiredAlert');
        this.onWarning('filterValueRequiredAlert');
        return false;
      } else if (this.checkDuplicateField()) {
        this.onWarning('filterDuplicateAlert');
        return false;
      } else if (this.checkEmptyFieldValue()) {
        this.onWarning('filterValueRequiredAlert');
        return false;
      } else if (this.checkEmptyFieldName()) {
        this.onWarning('filterNameRequiredAlert');
        return false;
      } else {
        return true;
      }
    }
  }

  // check if duplicate field return true if yes
  checkDuplicateField(): boolean {
    const fieldNames = this.filters.map((filter) => (filter.fieldName));
    return (new Set(fieldNames).size !== fieldNames.length);
  }

  // check if empty field name return true if yes
  checkEmptyFieldName(): boolean {
    const fieldNames = this.filters.map((filter) => (filter.fieldName));
    const emptyValues = [];
    fieldNames.forEach((value) => {
      if (value === '' || value === null) {
        emptyValues.push(1);
      }
    });
    return (emptyValues.length !== 0);
  }

  // check if empty flter value return true if yes
  checkEmptyFieldValue(): boolean {
    const filterValues = this.filters.map((filter) => (filter.filterValue));
    const emptyValues = [];
    filterValues.forEach((value) => {
      if (value === '' || value === null || value.length === 0) {
        emptyValues.push(1);
      }
    });
    return (emptyValues.length !== 0);
  }

  onWarning(name) {
    if (name === 'filtersRequiredAlert') {
      this.notifications.create('Filters Required!', 'At least one filter must be selected.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'filterDuplicateAlert') {
      this.notifications.create('Filter Duplicated !', 'Only one filter per Field is permitted.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'filterValueRequiredAlert') {
      this.notifications.create('Filter Value Required !', 'Please insert filter value.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'filterNameRequiredAlert') {
      this.notifications.create('Field Name Required!', 'Please do not leave Filter Field empty.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    }
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
