import { ChangeDetectorRef, AfterContentChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsLocaleService} from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import {timeRequired} from './../custom.validators';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ReportService, IFilter, FiltersRequest } from 'src/app/services/report.service';
import { isThisSecond } from 'date-fns';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html'
})
export class Step3Component implements OnInit, AfterContentChecked {
  @Input() reportFilters: IFilter[];
  filterRequest = new FiltersRequest();
  // form
  generationForm: FormGroup;
  get FormScheduled() { return this.generationForm.get('scheduled'); }
  get scheduledDate() { return this.generationForm.get('scheduledDate'); }
  get timeFrom() { return this.generationForm.get('timeFrom'); }
  get timeTo() { return this.generationForm.get('timeTo'); }
  get every() { return this.generationForm.get('every'); }
  get timeEvery() { return this.generationForm.get('timeEvery'); }
  get numberEvery() { return this.generationForm.get('numberEvery'); }
  // DatePicker + timePicker
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  mouseTime1 = new Date();
  mouseTime2 = new Date();
  mouseTime3 = new Date();

  bsInlineValue = new Date();

  @Input() value: string;

  scheduled = false;
  formSubmitAttempt: boolean;

  totalMeters: number;
  filteredMeters = 0;

  constructor(private notifications: NotificationsService, private localeService: BsLocaleService, private changeDetector: ChangeDetectorRef, private reportService: ReportService) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];

    // defined frensh local date
    defineLocale('fr', frLocale);
    this.localeService.use('fr');
   }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.generationForm = new FormGroup({
      scheduled: new FormControl(false, [Validators.required]),
      scheduledDate: new FormControl(null, [Validators.required]),
      timeFrom: new FormControl(null, [timeRequired()]),
      timeTo: new FormControl(null, [timeRequired()]),
      timeEvery: new FormControl(null, [timeRequired()]),
      every: new FormControl('month', [Validators.required]),
      numberEvery: new FormControl(1, [Validators.required])
    });
    this.reportService.getTotalMetersNumber().subscribe(
      (res) => {
        this.totalMeters = res.size;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmit() {
    this.formSubmitAttempt = true;
    if (this.generationForm.value.scheduled === false) {
      this.generationForm.value.scheduledDate = null;
      this.generationForm.value.timeEvery = null;
      this.generationForm.value.timeFrom = null;
      this.generationForm.value.timeTo = null;
      this.generationForm.value.every = null;
      this.generationForm.value.numberEvery = null;
    } else {
      if (this.generationForm.value.scheduledDate !== null && this.generationForm.value.scheduledDate.length !== 0) {
        this.generationForm.value.scheduledDate[0] = this.getDateNoTime(this.generationForm.value.scheduledDate[0]);
        this.generationForm.value.scheduledDate[1] = this.getDateNoTime(this.generationForm.value.scheduledDate[1]);
        if (this.every.value === 'month' || this.every.value === 'week' || this.every.value === 'day') {
          this.generationForm.value.timeEvery = new Date();
          this.timeEvery.setErrors(null);
        } else if (this.every.value === 'time') {
          this.generationForm.value.numberEvery = 1;
          this.numberEvery.setErrors(null);
        }
      }
    }
    return this.generationForm.value;
  }

  onSimulate() {
    this.filterRequest.filters = this.reportFilters;
    this.reportService.getFilteredMetersNumber(this.filterRequest).subscribe(
      (res) => {
        this.filteredMeters = res.size;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onWarning(name) {
    if (name === 'dateRequiredAlert') {
      this.notifications.create('Schedule Date !', 'Schedule Date is required.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'timeFromRequiredAlert') {
      this.notifications.create('Time From !', 'Time From is required.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'timeToRequiredAlert') {
      this.notifications.create('Time To !', 'Time To is required.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'timeEveryRequiredAlert') {
      this.notifications.create('Time Every !', 'Time Every is required.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'numberEveryRequiredAlert') {
      this.notifications.create('Select Number !', 'Number of months/weeks/days is required.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    }
    this.formSubmitAttempt = false;
  }

  @ViewChild('dateRequiredAlert') set nameRequiredAlert(element) {
    if (element) {
      this.onWarning('dateRequiredAlert');
    }
  }

  @ViewChild('timeFromRequiredAlert') set timeFromRequiredAlert(element) {
    if (element) {
      this.onWarning('timeFromRequiredAlert');
    }
  }

  @ViewChild('timeToRequiredAlert') set timeToRequiredAlert(element) {
    if (element) {
      this.onWarning('timeToRequiredAlert');
    }
  }

  @ViewChild('timeEveryRequiredAlert') set timeEveryRequiredAlert(element) {
    if (element) {
      this.onWarning('timeEveryRequiredAlert');
    }
  }

  @ViewChild('numberEveryRequiredAlert') set numberEveryRequiredAlert(element) {
    if (element) {
      this.onWarning('numberEveryRequiredAlert');
    }
  }
  getHoursAndMinutes(time) {
    return  time.getHours() + ':' + time.getMinutes();
  }

  getDateNoTime(date) {
    const timePortion = (date.getTime() - date.getTimezoneOffset() * 60 * 1000) % (3600 * 1000 * 24);
    return (new Date(date - timePortion));
  }

  choose( check: boolean ): void {
    this.scheduled = check;
  }

}
