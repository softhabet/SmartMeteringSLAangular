import {ChangeDetectorRef, AfterContentChecked, Component, OnInit, ViewChild} from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {requiredList} from './../custom.validators';
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

  formSubmitAttempt: boolean;
  columnsNotEmpty: boolean;

  constructor(private notifications: NotificationsService, private changeDetector: ChangeDetectorRef, private reportService: ReportService) {}

  public simpleList: Icolumns[][] = [[], []];

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
      })
    });
    // this.step1Form.controls.columns.setValidators([requiredList]);
  }

  onSubmit() {
    this.formSubmitAttempt = true;
    this.step1Form.value.columns = this.simpleList[1];
    if (this.step1Form.value.columns.length === 0) {
      this.columnsNotEmpty = false;
    } else {
      this.columnsNotEmpty = true;
    }
    return this.step1Form.value;
  }

  // onWarningNameRequired() {
  //   this.notifications.create('Report Name!', 'Report Name is required.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
  //   this.formSubmitAttempt = false;
  // }

  onWarning(name) {
    if (name === 'nameRequiredAlert') {
      this.notifications.create('Report Name !', 'Report Name is required.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
    } else if (name === 'nameLengthAlert') {
      this.notifications.create('Report Name !', 'Report Name must contain at least 2 characters.', NotificationType.Warn, { timeOut: 3000, showProgressBar: true });
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


