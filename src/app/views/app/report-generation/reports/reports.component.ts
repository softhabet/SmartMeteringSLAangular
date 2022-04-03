import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ApiService, IReport, IReportTable } from 'src/app/mydata/api.service';
import reports from 'src/app/mydata/reports';
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
  state = false;

  @Output() searchKeyUp: EventEmitter<any> = new EventEmitter();
  stateButtonCurrentState = '';
  stateButtonShowMessage = false;
  stateButtonMessage = '';
  stateButtonDisabled = false;

  displayMode = 'list';
  selectAllState = '';
  selected: IReport[] = [];
  data: IReportTable[] = [];
  reports: IReport[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  search = '';
  orderBy = '';
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  totalPage = 0;

  // @ViewChild('search') search: any;
  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  constructor(fb: FormBuilder, private apiService: ApiService, private router: Router) {
    const reportControls = {
      searchName: new FormControl(''),
      searchOwner: new FormControl(''),
      scheduled: new FormControl(''),
      status: new FormControl('')
    };
    this.reportForm = fb.group(reportControls);
   }

  ngOnInit(): void {
    this.loadData(this.itemsPerPage, this.currentPage, this.search, this.orderBy);
  }

  onChangeScheduled(value) {
    if (value === 'false') {
      this.state = true;
    } else {
      this.state = false;
    }
  }


  loadData(pageSize: number = 10, currentPage: number = 1, search: string = '', orderBy: string = '') {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.search = search;
    this.orderBy = orderBy;

    this.reports = reports.slice(0, 10).map(({ report_id, reportName, report_owner, description, creationDate, isScheduled, status}) => ({ report_id, reportName, report_owner, description, creationDate, isScheduled, status}));
    this.data = reports.slice(pageSize * (currentPage-1), pageSize * currentPage).map(({ report_id, reportName, report_owner, description, creationDate, isScheduled, status}) => ({ report_id, reportName, report_owner, description, creationDate, isScheduled, status, descriptionColor : '', scheduledColor : '', statusColor : ''}));
    this.data.forEach(r=>{
      if (r.description == "Meter"){
        r.descriptionColor = 'primary'
      } else if (r.description === "Event") {
        r.descriptionColor = 'secondary'
      };
      if (r.isScheduled == true){
        r.scheduledColor = 'success'
      } else if (r.isScheduled == false) {
        r.scheduledColor = 'danger'
      };
      if (r.status == "Active"){
        r.statusColor = 'success'
      } else if (r.status == "Finished") {
        r.statusColor = 'danger'
      }else if (r.status == "Not Started") {
        r.statusColor = 'warning'
      };
    });
    this.totalItem = this.reports.length;
    // this.totalPage = pageSize;

    // this.apiService.getReports(pageSize, currentPage, search, orderBy).subscribe(
    //   data => {
    //     if (data) {
    //       this.isLoading = false;
    //       this.data = data.data;
    //       this.totalItem = data.totalItem;
    //       this.totalPage = data.totalPage;
    //     } else {
    //       this.endOfTheList = true;
    //     }
    //   },
    //   error => {
    //     this.isLoading = false;
    //   }
    // );
  }

  onSubmit() {
    console.log('submitted');
    console.log(this.reportForm.value);
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
      }, 2000);
    }, 1000);
  }


  SearchKeyUp(event) {
    const val = event.target.value.toLowerCase().trim();
    this.loadData(this.itemsPerPage, 1, val, this.orderBy);
  }

  itemsPerPageChange(perPage: number) {
    this.loadData(perPage, 1, this.search, this.orderBy);
  }

  pageChanged(event: any): void {
    this.loadData(this.itemsPerPage, event.page, this.search, this.orderBy);
  }

  onContextMenuClick(action: string, event) {
    console.log('onContextMenuClick -> action :  ', action, ', item.row :', event.reportName);
  }

}
