import {ChangeDetectorRef, AfterContentChecked, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {frLocale} from 'ngx-bootstrap/locale';
import { ReportService, IFilter, IFilterSave } from 'src/app/services/report.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import {timeRequired} from './../custom.validators';
import { FilterService } from 'src/app/services/filter.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { FiltersModalComponent } from './filters-modal/filters-modal.component';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html'
})
export class Step2Component implements OnInit, AfterContentChecked {
  bsModalRef: BsModalRef;

  // selected filters
  selected: any[] = [];

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

  constructor(private filterService: FilterService, private modalService: BsModalService, private translateService: TranslateService,
              private notifications: NotificationsService, private localeService: BsLocaleService, private changeDetector: ChangeDetectorRef, private reportService: ReportService) {
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
    this.mouseTimes1.splice(this.filters.indexOf(filter), 1);
    this.mouseTimes2.splice(this.filters.indexOf(filter), 1);
    this.bsRangeValues.splice(this.filters.indexOf(filter), 1);
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

  // send filters to wizard
  sendFilters() {
    this.filters.map((filter, index) => {
      if (filter.filterType === 'date') {
        const time1 = this.mouseTimes1[index];
        if (filter.filterValue !== '' && filter.filterValue !== null && time1 == null) {
          filter.filterValue = this.getDateNoTime(filter.filterValue);
        } else if (filter.filterValue !== '' && filter.filterValue !== null && time1 != null) {
          filter.filterValue = this.getDatePlusTime(filter.filterValue, time1);
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
        }
      }
    });
    // this.checkFilters();
    return this.getFiltersToSave(this.filters);
  }

  getFiltersToSave(filters) {
    const reportFilters: IFilter[] = [];
    filters.forEach((filter) => {
      if (filter.filterType === 'listOne') {
        reportFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: filter.filterValue,
          filterType: filter.filterType
        });
      } else if (filter.filterType === 'listMulti') {
        reportFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: this.getList(filter.filterValue),
          filterType: filter.filterType
        });
      } else if (filter.filterType === 'date') {
        reportFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: this.getTimestamp(filter.filterValue).toString(),
          filterType: filter.filterType
        });
      } else if (filter.filterType === 'dateRange') {
        const dateArray = [this.getTimestamp(filter.filterValue[0]).toString(), this.getTimestamp(filter.filterValue[1]).toString()];
        reportFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: this.getList(dateArray),
          filterType: filter.filterType
        });
      } else {
        reportFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: filter.filterValue,
          filterType: filter.filterType
        });
      }
    });
    return reportFilters;
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

  onSaveFilters() {
    this.notifications.create('Filters Saved!', 'Filters saved.', NotificationType.Success, { timeOut: 3000, showProgressBar: true });
  }

  saveFilters(filters) {
    const savedFilters: IFilterSave[] = [];
    filters.forEach((filter) => {
      if (filter.filterType === 'listOne') {
        savedFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: filter.filterValue,
          filterType: filter.filterType,
          saved: true
        });
      } else if (filter.filterType === 'listMulti') {
        savedFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: this.getList(filter.filterValue),
          filterType: filter.filterType,
          saved: true
        });
      } else if (filter.filterType === 'date') {
        savedFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: this.getTimestamp(filter.filterValue).toString(),
          filterType: filter.filterType,
          saved: true
        });
      } else if (filter.filterType === 'dateRange') {
        const dateArray = [this.getTimestamp(filter.filterValue[0]).toString(), this.getTimestamp(filter.filterValue[1]).toString()];
        savedFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: this.getList(dateArray),
          filterType: filter.filterType,
          saved: true
        });
      } else {
        savedFilters.push({
          fieldName: filter.fieldName,
          operator: filter.operator,
          filterValue: filter.filterValue,
          filterType: filter.filterType,
          saved: true
        });
      }
    });
    this.filterService.saveFilters(savedFilters).subscribe(
      (res) => {
        this.onSaveFilters();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openModalWithComponent() {
    const initialState = {
      columns: [
        { prop: 'fieldName', name: 'Field' },
        { prop: 'operator', name: 'Operator' },
        { prop: 'filterValue', name: 'Value' },
        { prop: 'filterId', name: 'Check' },
      ],
      rows: [],
      list: [],
      selected: [],
      // title: this.translateService.instant('modal.modal-title')
      title: 'Filters'
    };
    this.bsModalRef = this.modalService.show(FiltersModalComponent, { initialState, class: 'modal-dialog-centered modal-lg' });
    this.bsModalRef.content.closeBtnName = this.translateService.instant('modal.close');
    this.bsModalRef.content.passSelected.subscribe((receivedFilters) => {
      receivedFilters.forEach(filter => {
        this.bsRangeValues.push(this.bsRangeValue);
        if (filter.filterType === 'listMulti') {
          const string = filter.filterValue.split(',');
          filter.filterValue = [];
          string.forEach(value => {
            filter.filterValue.push(value);
          });
          this.mouseTimes1.push(this.mouseTime);
          this.mouseTimes2.push(this.mouseTime);
          this.filters.push(filter);
        } else if (filter.filterType === 'date' ) {
          filter.filterValue = (new Date(filter.filterValue * 1000));
          this.mouseTimes1.push(this.getTime(filter.filterValue));
          this.mouseTimes2.push(this.mouseTime);
          this.filters.push(filter);
        } else if (filter.filterType === 'dateRange' ) {
          const string = filter.filterValue.split(',');
          filter.filterValue = [];
          string.forEach(value => {
            filter.filterValue.push(new Date(value * 1000));
          });
          this.mouseTimes1.push(this.getTime(this.getTime(filter.filterValue[0])));
          this.mouseTimes2.push(this.getTime(this.getTime(filter.filterValue[1])));
          this.filters.push(filter);
        } else {
          this.mouseTimes1.push(this.mouseTime);
          this.mouseTimes2.push(this.mouseTime);
          this.filters.push(filter);
        }
      });
    });
  }

  // fix timestamp
  getTime(date) {
    // const date = new Date(timestamp * 1000);
    const hour = date.getHours();
    const min = date.getMinutes();
    return new Date(((hour - 1) * 3600 + min * 60) * 1000);
  }

}
