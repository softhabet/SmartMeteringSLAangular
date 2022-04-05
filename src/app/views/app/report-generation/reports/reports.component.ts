import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ReportService, IReport, IReportResponse } from 'src/app/services/report.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
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

  @Output() searchKeyUp: EventEmitter<any> = new EventEmitter();
  stateButtonCurrentState = '';
  stateButtonShowMessage = false;
  stateButtonMessage = '';
  stateButtonDisabled = false;

  displayMode = 'list';
  res: IReportResponse[] = [];
  reportsList: IReport[] = [];
  currentPage = 0;
  itemsPerPage = 10;
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;

  // @ViewChild('search') search: any;
  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  constructor(fb: FormBuilder, private reportService: ReportService, private router: Router) {
    const reportControls = {
      searchName: new FormControl(''),
      searchOwner: new FormControl(''),
      scheduled: new FormControl(''),
      status: new FormControl('')
    };
    this.reportForm = fb.group(reportControls);
   }

  ngOnInit(): void {
    this.loadData(this.itemsPerPage, this.currentPage);
  }

  loadData(pageSize: number = 10, currentPage: number = 0, searchName: string = '', searchOwner: string = '', status: string = '') {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    if (!this.isScheduledSelected()) {
      this.reportService.getReports(pageSize, currentPage, searchName, searchOwner, status).subscribe(
        res => {
          if (res) {
            this.isLoading = false;
            this.reportsList = res.reportsList;
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

  loadDataScheduled(pageSize: number = 10, currentPage: number = 0, searchName: string = '', searchOwner: string = '', scheduled: boolean = this.isScheduled, status: string = '') {
    if (this.isScheduledSelected()) {
      this.reportService.getReportsScheduled(pageSize, currentPage, searchName, searchOwner, scheduled, status).subscribe(
        res => {
          if (res) {
            this.isLoading = false;
            this.reportsList = res.reportsList;
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

  onChangeScheduled(value) {
    if (value === 'false') {
      this.isScheduled = true;
    } else {
      this.isScheduled = false;
    }
  }

  formatDate(date) {
    if (typeof date !== 'undefined') {
      const dates = date.split('+');
      return dates[0].replace('T', ' ');
    }
  }

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

  reportIndex(index) {
    return index + 1 + this.itemsPerPage * (this.currentPage - 1);
  }

  onSubmit() {
    console.log(this.reportForm.value)
    if (!this.isScheduledSelected()) {
      this.loadData(this.itemsPerPage, 0, this.reportForm.value.searchName, this.reportForm.value.searchOwner, this.RemoveChoose(this.reportForm.value.status));
    } else {
      this.loadDataScheduled(this.itemsPerPage, 0, this.reportForm.value.searchName, this.reportForm.value.searchOwner, this.getBoolean(this.RemoveChoose(this.reportForm.value.scheduled)), this.RemoveChoose(this.reportForm.value.status));

    }
  }

  isScheduledSelected() {
    return (this.reportForm.value.scheduled !== ('Choose...') && this.reportForm.value.scheduled !== (''));
  }

  RemoveChoose(val) {
    if (val === 'Choose...') {
      return '';
    } else {
      return val;
    }
  }

  getBoolean(string) {
    return string === 'true';
  }


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
    console.log('onContextMenuClick -> action :  ', action, ', item.row :', event.reportName);
  }

}
