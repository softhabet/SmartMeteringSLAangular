import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ApiService, IReport, IReportTable } from 'src/app/mydata/api.service';
import reports from 'src/app/mydata/reports';
import { ContextMenuComponent } from 'ngx-contextmenu';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {

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
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadData(this.itemsPerPage, this.currentPage, this.search, this.orderBy);
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

  onStateButtonClick(event) {
    if (this.stateButtonDisabled) {
      return;
    }
    this.stateButtonDisabled = true;
    this.stateButtonCurrentState = 'show-spinner';
    // this.SearchKeyUp(event);
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
    console.log('onContextMenuClick -> action :  ', action, ', item.row :', event.title);
  }

}
