import { Component, OnInit, ViewChild } from '@angular/core';
import {Step1Component} from './step1/step1.component';
import {Step2Component} from './step2/step2.component';
import {Step3Component} from './step3/step3.component';
import { Router } from '@angular/router';
import { ReportService, report, IReportType, Icolumns, IFilter } from 'src/app/services/report.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-generation-meter',
  templateUrl: './generation-meter.component.html'
})

export class GenerationMeterComponent implements OnInit {
  @ViewChild(Step1Component) step1: Step1Component;
  @ViewChild(Step2Component) step2: Step2Component;
  @ViewChild(Step3Component) step3: Step3Component;
  constructor(private reportService: ReportService, private notifications: NotificationsService, private router: Router) { }

  report: report = new report();
  reportType: IReportType = {
    typeId : 1,
  };
  selectedColumns: Icolumns[];
  filters: IFilter[];

  submitStep1() {
    return this.step1.onSubmit();
  }

  submitStep2() {
    return console.log(this.step2.getFilters());
  }

  submitStep3() {
    return this.step3.onSubmit();
  }

  postReport() {
    this.getReportData();
    this.reportService.createReport(this.report, 1).subscribe(
      (res) => {
        console.log(res);
        this.onSuccess();
        setTimeout(() => {this.router.navigateByUrl('app/report-generation/generation/reports'); } , 3000);
      },
      (err) => {
        console.log(err);
        this.onError();
        setTimeout(() => {this.router.navigateByUrl('app/report-generation/generation/reports'); } , 3000);
      }
    );
  }

  onSuccess() {
    this.notifications.create('Created !', 'Report created.', NotificationType.Success, { timeOut: 3000, showProgressBar: true });
  }

  onError() {
      this.notifications.create('Error !', 'Report not created.', NotificationType.Error, { timeOut: 3000, showProgressBar: true });
  }

  getReportData() {
    const step1 = this.submitStep1();
    const step2 = this.step2.getFilters();
    const step3 = this.submitStep3();
    this.report.reportName = step1.reportName;
    this.report.reportDescription = step1.reportDescription;
    this.report.reportFolderPath = this.getFileNameParts(step1.prefix, step1.separator, step1.timestamp);
    this.report.isCompressedExport = step1.checks.compressed;
    this.report.isTimeStampedFolder = step1.checks.timestamped;
    this.report.selectedColumns = step1.columns;
    this.report.filters = this.getFiltersToSave(step2);
    this.report.isScheduled = step3.scheduled;
    if (this.report.isScheduled) {
      this.report.scheduleStart = this.getScheduelStart(this.getTimestamp(step3.scheduledDate[0]), this.getHoursAndMinutes(step3.timeFrom));
      this.report.scheduleEnd = this.getScheduelEnd(this.getTimestamp(step3.scheduledDate[1]), this.getHoursAndMinutes(step3.timeTo));
      this.report.scheduleEvery = this.getScheduelEvery(this.getHoursAndMinutes(step3.timeEvery));
    }
    this.report.reportType = this.reportType;
    console.log(this.report);
  }

  getFileNameParts(prefix, separator, timestamp) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date().getDate();
    const hour = new Date().getHours();
    const min = new Date().getMinutes();
    let timeFormat: string;
    if (timestamp === 'yyyyMMddHHmm') {
      timeFormat = year.toString() +  month.toString() + day.toString() + hour.toString() + min.toString();
    } else if (timestamp === 'ddMMyyyyHHmm') {
      timeFormat = day.toString() + month.toString() + year.toString() + hour.toString() + min.toString();
    } else {
      // MMddyyyyHHmm
      timeFormat = month.toString() + day.toString() + year.toString() + hour.toString() + min.toString();
    }
    const random = this.generateString(13);
    return (prefix + separator + timeFormat + separator + random);
  }

  generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

  getHoursAndMinutes(time) {
    return  time.getHours() + ':' + time.getMinutes();
  }

  getScheduelStart(dateStart, timeStart) {
    const array = timeStart.split(':');
    const hour: number = array[0];
    const min: number = array[1];
    return dateStart + (hour * 3600 + min * 60);
  }

  getScheduelEnd(dateEnd, timeEnd) {
    const array = timeEnd.split(':');
    const hour: number = array[0];
    const min: number = array[1];
    return dateEnd + (hour * 3600 + min * 60);
  }

  getScheduelEvery(timeEvery) {
    const array = timeEvery.split(':');
    const hour: number = array[0];
    const min: number = array[1];
    return (hour * 3600 + min * 60);
  }

  getTimestamp(date): number {
    return (new Date(date).getTime() / 1000);
  }

  ngOnInit(): void {
  }

}
