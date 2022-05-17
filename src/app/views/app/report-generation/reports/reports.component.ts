import { Component, OnInit, ViewChild, EventEmitter, Output, OnDestroy} from '@angular/core';
import { ReportService, IReportInfo, IReportResponse } from 'src/app/services/report.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InstanceMsgService } from 'src/app/services/instanceMsg.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit, OnDestroy {

  message: string;
  subscription: Subscription;

  reportForm: FormGroup;
  get searchName() {
    return this.reportForm.get('searchName');
  }
  get searchOwner() {
    return this.reportForm.get('searchOwner');
  }
  get scheduled() {
    return this.reportForm.get('scheduled');
  }
  get status() {
    return this.reportForm.get('status');
  }
  // if true : is scheduled
  isScheduled = false;

  stateButtonCurrentState = '';
  stateButtonShowMessage = false;
  stateButtonMessage = '';
  stateButtonDisabled = false;

  displayMode = 'list';
  res: IReportResponse[] = [];
  reportsList: IReportInfo[] = [];
  currentPage = 0;
  itemsPerPage = 10;
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  constructor(fb: FormBuilder, private notifications: NotificationsService, private instanceMsg: InstanceMsgService, private reportService: ReportService, private router: Router, private route: ActivatedRoute
    , private spinner: NgxSpinnerService) {
    const reportControls = {
      searchName: new FormControl(''),
      searchOwner: new FormControl(''),
      scheduled: new FormControl(''),
      status: new FormControl('')
    };
    this.reportForm = fb.group(reportControls);
   }

  ngOnInit(): void {
    this.subscription = this.instanceMsg.currentMessage.subscribe(message => {
      if (message !== this.message && message !== '' && message !== null ) {
        this.message = message;
        this.generateInstance(message);
      }
    });
    this.loadData(this.itemsPerPage, this.currentPage);
  }

  generateInstance(reportName) {
    this.spinner.show();
    this.reportService.generateInstance(reportName).subscribe(
      (res) => {
        this.spinner.hide();
        this.notifications.create('Created !', 'Report instance created.', NotificationType.Success, { timeOut: 3000, showProgressBar: true });
        setTimeout(() => {this.router.navigateByUrl('app/generated-reports').then(() => {this.instanceMsg.changeMessage(''); }); } , 3000);
      },
      (err) => {
        console.log(err);
        this.notifications.create('Error !', 'Error creating report instance.', NotificationType.Error, { timeOut: 3000, showProgressBar: true });
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // get data paginated from back
  loadData(pageSize: number = 10, currentPage: number = 0, searchName: string = '', searchOwner: string = '', status: string = '') {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    if (!this.isScheduledSelected()) {
      this.reportService.getReports(pageSize, currentPage, searchName, searchOwner, status).subscribe(
        res => {
          if (res) {
            this.isLoading = false;
            this.reportsList = res.reportsList;
            this.onDataEmpty(res.reportsList);
            this.totalItem = res.totalItems;
            this.totalPage = res.totalPages;
          } else {
            this.endOfTheList = true;
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }

  // get data paginated from back when scheduled active
  loadDataScheduled(pageSize: number = 10, currentPage: number = 0, searchName: string = '', searchOwner: string = '', scheduled: boolean = this.isScheduled, status: string = '') {
    if (this.isScheduledSelected()) {
      this.reportService.getReportsScheduled(pageSize, currentPage, searchName, searchOwner, scheduled, status).subscribe(
        res => {
          if (res) {
            this.isLoading = false;
            this.reportsList = res.reportsList;
            this.onDataEmpty(res.reportsList);
            this.totalItem = res.totalItems;
            this.totalPage = res.totalPages;
          } else {
            this.endOfTheList = true;
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }

  // pop up when no reports available
  onDataEmpty(list) {
    if (list.length === 0) {
      this.notifications.create('No reports found !', 'No reports found with search parameters.', NotificationType.Error, { timeOut: 3000, showProgressBar: true });
    }
  }

  // on click search submit form
  onSubmit() {
    console.log(this.reportForm.value);
    if (!this.isScheduledSelected()) {
      this.loadData(this.itemsPerPage, 0, this.reportForm.value.searchName, this.reportForm.value.searchOwner, this.RemoveChoose(this.reportForm.value.status));
    } else {
      this.loadDataScheduled(this.itemsPerPage, 0, this.reportForm.value.searchName, this.reportForm.value.searchOwner, this.getBoolean(this.RemoveChoose(this.reportForm.value.scheduled)), this.RemoveChoose(this.reportForm.value.status));
    }
  }

  // on click clear
  clearForm() {
    this.reportForm.value.searchName = '';
    this.reportForm.value.searchOwner = '';
    this.reportForm.value.scheduled = '';
    this.reportForm.value.status = '';
    this.isScheduled = false;
    this.reportForm.get('scheduled').setValue('');
    this.reportForm.get('status').setValue('');
    this.reportForm.get('searchName').setValue('');
    this.reportForm.get('searchOwner').setValue('');
    this.itemsPerPage = 10;
    this.currentPage = 0;
    this.loadData(this.itemsPerPage, this.currentPage);
  }

  // change select scheduled
  onChangeScheduled(value) {
    if (value === 'false') {
      this.isScheduled = true;
    } else {
      this.isScheduled = false;
    }
  }

  // format date for table
  formatDate(date) {
    if (typeof date !== 'undefined') {
      const dates1 = date.split('+');
      const dates2 = dates1[0].split('.');
      return dates2[0].replace('T', ' ');
    }
  }

  // get yes or no for isScheduled table
  getScheduled(bool: boolean): string {
    if (bool) {
      return 'YES';
    } else {
      return 'NO';
    }
  }

  // generate pills colors
  typeColor(type) {
    if (type === 'METER') {
      return 'primary';
    } else if (type === 'EVENT') {
      return 'secondary';
    }
  }

  scheduledColor(scheduled) {
    if (scheduled === true) {
      return 'success';
    } else if (scheduled === false) {
      return 'danger';
    }
  }

  statusColor(status) {
    if (status === 'ACTIVE') {
      return 'success';
    } else if (status === 'FINISHED') {
      return 'danger';
    } else if (status === 'NOT_STARTED') {
      return 'warning';
    }
  }

  // generate indexes for reports
  reportIndex(index) {
    if (this.currentPage === 0) {
      return index + 1 + this.itemsPerPage * (this.currentPage);
    }
    return index + 1 + this.itemsPerPage * (this.currentPage - 1);
  }

  // enable or disable status
  isScheduledSelected() {
    return (this.reportForm.value.scheduled !== ('Choose...') && this.reportForm.value.scheduled !== (''));
  }

  // remove choose from form form values
  RemoveChoose(val) {
    if (val === 'Choose...') {
      return '';
    } else {
      return val;
    }
  }

  // get boolean value of is scheduled
  getBoolean(string) {
    return string === 'true';
  }

// on click search
  onStateButtonClick(event) {
    if (this.stateButtonDisabled) {
      return;
    }
    this.stateButtonDisabled = true;
    this.stateButtonCurrentState = 'show-spinner';
    this.onSubmit();
    setTimeout(() => {
      this.stateButtonCurrentState = 'show-success';
      setTimeout(() => {
        this.stateButtonCurrentState = '';
        this.stateButtonShowMessage = false;
        this.stateButtonDisabled = false;
      }, 750);
    }, 1250);
  }

  itemsPerPageChange(perPage: number) {
    this.itemsPerPage = perPage;
    if (!this.isScheduledSelected()) {
      this.loadData(this.itemsPerPage, 0, this.reportForm.value.searchName, this.reportForm.value.searchOwner, this.RemoveChoose(this.reportForm.value.status));
    } else {
      this.loadDataScheduled(this.itemsPerPage, 0, this.reportForm.value.searchName, this.reportForm.value.searchOwner, this.getBoolean(this.RemoveChoose(this.reportForm.value.scheduled)), this.RemoveChoose(this.reportForm.value.status));
    }
  }

  pageChanged(event: any): void {
    if (!this.isScheduledSelected()) {
      this.loadData(this.itemsPerPage, event.page - 1, this.reportForm.value.searchName, this.reportForm.value.searchOwner, this.RemoveChoose(this.reportForm.value.status));
    } else {
      // tslint:disable-next-line: max-line-length
      this.loadDataScheduled(this.itemsPerPage, event.page - 1, this.reportForm.value.searchName, this.reportForm.value.searchOwner, this.getBoolean(this.RemoveChoose(this.reportForm.value.scheduled)), this.RemoveChoose(this.reportForm.value.status));
    }
  }

  onContextMenuClick(action: string, event) {
    if (action === 'generate') {
      this.generateInstance(event.reportName);
    } else if (action === 'delete') {
      this.reportService.deleteReport(event.reportName).subscribe(
        (res) => {
          const index = this.reportsList.indexOf(event);
          if (index > -1) {
            this.reportsList.splice(index, 1);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } else if (action === 'details') {
        // window.location.href = 'http://localhost:8180/report-generation-service/reports/details/' + event.reportName;
        this.router.navigateByUrl('app/report-generation/details/' + event.reportName);
    } else if (action === 'instances') {
      this.router.navigateByUrl('app/generated-reports/' + event.reportName);
    }
  }

}
