import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import {Step1Component} from './step1/step1.component';
import {Step2Component} from './step2/step2.component';
import {Step3Component} from './step3/step3.component';
import { Router } from '@angular/router';
import { ReportService, Report, IReportType, Icolumns, IFilter } from 'src/app/services/report.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { WizardComponent as ArcWizardComponent } from 'angular-archwizard';
import { InstanceMsgService } from 'src/app/services/instanceMsg.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-generation-meter',
  templateUrl: './generation-meter.component.html'
})

export class GenerationMeterComponent implements OnInit, OnDestroy {
  @ViewChild(Step1Component) step1: Step1Component;
  @ViewChild(Step2Component) step2: Step2Component;
  @ViewChild(Step3Component) step3: Step3Component;
  @ViewChild('wizard') wizard: ArcWizardComponent;
  constructor(private authservice: AuthService, private reportService: ReportService, private instanceMsg: InstanceMsgService, private notifications: NotificationsService, private router: Router) { }

  message: string;
  subscription: Subscription;

  report: Report = new Report();
  reportType: IReportType = {
    typeId : 1,
  };
  selectedColumns: Icolumns[];
  filters: IFilter[];
  reportFilters: IFilter[];

  onNextStep1() {
    this.step1.onSubmit();
    if (this.step1.reportName.value !== '') {
      this.step1.checkReportNameExisting(this.step1.reportName.value).then( (data) => {
        if (this.step1.step1Form.valid && this.step1.columnsNotEmpty && !this.step1.reportPrefixExists && !data) {
          this.wizard.goToNextStep();
        }
      });
    } else {
      if (this.step1.step1Form.valid && this.step1.columnsNotEmpty && !this.step1.reportPrefixExists) {
        this.wizard.goToNextStep();
      }
    }
  }

  onNextStep2() {
    this.step2.sendFilters();
    if (this.step2.checkFilters()) {
      this.wizard.goToNextStep();
      this.reportFilters = this.step2.sendFilters();
    }
  }

  onNextStep3() {
    this.step3.onSubmit();
    if (this.step3.FormScheduled.value) {
      if (this.step3.generationForm.valid) {
        this.postReport();
      }
    } else {
      this.postReport();
    }
  }

  postReport() {
    this.getReportData();
    this.reportService.createReport(this.report, this.authservice.getTokenSubject()).subscribe(
      (res) => {
        console.log(res);
        this.onSuccess();
        if (this.report.isScheduled) {
          setTimeout(() => {this.router.navigateByUrl('app/report-generation/generation/reports').then(() => {this.instanceCommand(''); }); } , 3000);
        } else {
          setTimeout(() => {this.router.navigateByUrl('app/report-generation/generation/reports').then(() => {this.instanceCommand(this.report.reportName); }); } , 3000);
        }
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
    const step1 = this.step1.onSubmit();
    const step2 = this.step2.sendFilters();
    const step3 = this.step3.onSubmit();
    this.report.reportName = step1.reportName;
    this.report.reportDescription = step1.reportDescription;
    this.report.prefix = step1.prefix;
    this.report.separator = step1.separator;
    this.report.timestamp = step1.timestamp;
    if (step1.random.random) {
      this.report.randomId = this.step1.randomValue;
    }
    this.report.isCompressedExport = step1.checks.compressed;
    this.report.isTimeStampedFolder = step1.checks.timestamped;
    this.report.selectedColumns = step1.columns;
    this.report.filters = step2;
    this.report.isScheduled = step3.scheduled;
    if (this.report.isScheduled) {
      this.report.scheduleStart = this.getScheduelStart(this.getTimestamp(step3.scheduledDate[0]), this.getHoursAndMinutes(step3.timeFrom));
      this.report.scheduleEnd = this.getScheduelEnd(this.getTimestamp(step3.scheduledDate[1]), this.getHoursAndMinutes(step3.timeTo));
      this.report.scheduleEvery = this.getScheduelEvery(step3);
    }
    this.report.reportType = this.reportType;
    console.log(this.report);
  }

  getSeparator(separator: string) {
    if (separator === '_') {
      return 'UnderScore';
    } else if (separator === '-') {
      return 'Dash';
    } else if (separator === '/') {
      return 'Slash';
    }
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

  getScheduelEvery(form) {
    const every = form.every;
    if (every === 'month') {
      return (form.numberEvery * 2628000);
    } else if (every === 'week') {
      return (form.numberEvery * 604800);
    } else if (every === 'day') {
      return (form.numberEvery * 86400);
    } else {
      const time = form.timeEvery;
      const hour: number = time.getHours();
      const min: number = time.getMinutes();
      return (hour * 3600 + min * 60);
    }
  }

  getTimestamp(date): number {
    return (new Date(date).getTime() / 1000);
  }

  instanceCommand(reportName: string) {
    this.instanceMsg.changeMessage(reportName);
  }

  ngOnInit(): void {
    this.subscription = this.instanceMsg.currentMessage.subscribe(message => this.message = message);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
