import {ChangeDetectorRef, AfterContentChecked, Component, OnInit, ViewChild} from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ReportService, Icolumns} from 'src/app/services/report.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html'
})
export class Step1Component implements OnInit, AfterContentChecked {
  step1Form: FormGroup;
  get reportName() { return this.step1Form.get('reportName'); }
  get reportDescription() { return this.step1Form.get('reportDescription'); }
  get separator() { return this.step1Form.get('separator'); }
  get prefix() { return this.step1Form.get('prefix'); }
  get timestamp() { return this.step1Form.get('timestamp'); }
  get columns() { return this.step1Form.get('columns'); }
  get random() { return this.step1Form.get('random'); }

  formSubmitAttempt: boolean;
  columnsNotEmpty: boolean;
  reportExists: boolean;
  reportFileNameExists: boolean;

  randomValue: string;
  reportFileName: string;

  constructor(private notifications: NotificationsService, private changeDetector: ChangeDetectorRef, private reportService: ReportService) {}

  simpleList: Icolumns[][] = [[], []];
  separators = [];
  timestamps = [];
  reportFileNames = [];

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.reportService.getColumns(1).subscribe(
      (res) => {
        this.simpleList[0] = res;
      },
      (err) => {
        console.log(err);
      }
    );
    this.reportService.getReportSeparators().subscribe(
      (res) => {
        res.map((sep) => this.separators.push(sep));
      },
      (err) => {
        console.log(err);
      }
    );
    this.reportService.getReportTimeStamps().subscribe(
      (res) => {
        res.map((stamp) => this.timestamps.push(stamp));
      },
      (err) => {
        console.log(err);
      }
    );
    this.reportService.getReportFileNames().subscribe(
      (res) => {
        res.map((name) => this.reportFileNames.push(name.reportFileName));
        // this.timestamps = res;
      },
      (err) => {
        console.log(err);
      }
    );
    this.step1Form = new FormGroup({
      reportName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      reportDescription: new FormControl('', [Validators.required, Validators.minLength(2)]),
      separator: new FormControl('_', [Validators.required]),
      prefix: new FormControl('', [Validators.required, Validators.minLength(2)]),
      timestamp: new FormControl('yyyyMMddHHmm', [Validators.required]),
      columns: new FormControl([]),
      checks: new FormGroup({
        compressed: new FormControl(false),
        timestamped: new FormControl(false)
      }),
      random: new FormGroup({
        random: new FormControl(false),
      })
    });
    this.randomValue = this.generateString(13);
    this.reportFileName = this.getFileNameParts( this.step1Form.value.prefix,  this.step1Form.value.separator,  this.step1Form.value.timestamp, this.step1Form.value.random.random);
  }

  // checkReportNameExisting(reportName) {
  //   this.reportService.checkReportName(reportName).subscribe(
  //     (res) => {
  //       this.reportExistsRes.push(res);
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  checkReportNameExisting(reportName) {
    return this.reportService.checkReportName(reportName).toPromise();
  }

  onChangeFileName() {
    this.reportFileName = this.getFileNameParts(this.step1Form.value.prefix, this.step1Form.value.separator, this.step1Form.value.timestamp, this.step1Form.value.random.random);
    this.reportFileNameExists = this.reportFileNames.includes(this.reportFileName);
  }

  // check if report file name exists
  onChangePrefix() {
    this.reportFileName = this.getFileNameParts(this.step1Form.value.prefix, this.step1Form.value.separator, this.step1Form.value.timestamp, this.step1Form.value.random.random);
    this.reportFileNameExists = this.reportFileNames.includes(this.reportFileName);
  }

  getFileNameParts(prefix, separator, timestamp, randomized) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const hour = new Date().getHours();
    const min = new Date().getMinutes();
    let timeFormat: string;
    if (timestamp === 'yyyyMMddHHmm') {
      timeFormat = year.toString() +  this.DateToString(month) + this.DateToString(day) + this.DateToString(hour) + this.DateToString(min);
    } else if (timestamp === 'ddMMyyyyHHmm') {
      timeFormat = this.DateToString(day) + this.DateToString(month) + year.toString() + this.DateToString(hour) + this.DateToString(min);
    } else {
      // MMddyyyyHHmm
      timeFormat = this.DateToString(month) + this.DateToString(day) + year.toString() + this.DateToString(hour) + this.DateToString(min);
    }
    if (randomized) {
      return (prefix + separator + 'METER' + separator + timeFormat + separator + this.randomValue);
    } else {
      return (prefix + separator + 'METER' + separator + timeFormat);
    }
  }

  DateToString(date) {
    const string = date.toString();
    if (string.length === 1) {
      return ('0' + string);
    } else {
      return string;
    }
  }

  generateString(length) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  onSubmit() {
    if (this.reportName.value !== '') {
      this.checkReportNameExisting(this.reportName.value).then((data) => {
        this.reportExists = data;
        this.formSubmitAttempt = true;
        this.step1Form.value.columns = this.simpleList[1];
        if (this.step1Form.value.columns.length === 0) {
        this.columnsNotEmpty = false;
        } else {
          this.columnsNotEmpty = true;
        }
      });
    } else {
      this.formSubmitAttempt = true;
      this.step1Form.value.columns = this.simpleList[1];
      if (this.step1Form.value.columns.length === 0) {
        this.columnsNotEmpty = false;
      } else {
        this.columnsNotEmpty = true;
      }
    }
    return this.step1Form.value;
  }

  onWarning(name) {
    if (name === 'nameRequiredAlert') {
      this.notifications.create('Report Name !', 'Report Name is required.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'nameLengthAlert') {
      this.notifications.create('Report Name !', 'Report Name must contain at least 2 characters.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'nameExistsAlert') {
      this.notifications.create('Report Name !', 'Report Name already Exists please choose a new one.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'descriptionRequiredAlert') {
      this.notifications.create('Report Description !', 'Report Description is required.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'descriptionLengthAlert') {
      this.notifications.create('Report Description !', 'Report Description must contain at least 2 characters.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'prefixRequiredAlert') {
      this.notifications.create('Report Prefix !', 'Report Prefix is required.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'prefixLengthAlert') {
      this.notifications.create('Report Prefix !', 'Report prefix must contain at least 2 characters.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'columnsEmptyAlert') {
      this.notifications.create('Selected Columns Empty !', 'Selected Columns must contain at least 1 element.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    }
    this.formSubmitAttempt = false;
  }

  @ViewChild('nameRequiredAlert') set nameRequiredAlert(element) {
    if (element) {
      this.onWarning('nameRequiredAlert');
    }
  }
  @ViewChild('nameLengthAlert') set nameLengthAlert(element) {
    if (element) {
      this.onWarning('nameLengthAlert');
    }
  }
  @ViewChild('nameExistsAlert') set nameExistsAlert(element) {
    if (element) {
      this.onWarning('nameExistsAlert');
    }
  }
  @ViewChild('descriptionRequiredAlert') set descriptionRequiredAlert(element) {
    if (element) {
      this.onWarning('descriptionRequiredAlert');
    }
  }
  @ViewChild('descriptionLengthAlert') set descriptionLengthAlert(element) {
    if (element) {
      this.onWarning('descriptionLengthAlert');
    }
  }
  @ViewChild('prefixRequiredAlert') set prefixRequiredAlert(element) {
    if (element) {
      this.onWarning('prefixRequiredAlert');
    }
  }
  @ViewChild('prefixLengthAlert') set prefixLengthAlert(element) {
    if (element) {
      this.onWarning('prefixLengthAlert');
    }
  }
  @ViewChild('columnsEmptyAlert') set columnsEmptyAlert(element) {
    if (element) {
      this.onWarning('columnsEmptyAlert');
    }
  }

  public removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

}


