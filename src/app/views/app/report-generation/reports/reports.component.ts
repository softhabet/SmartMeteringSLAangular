import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ApiService } from 'src/app/mydata/api.service';
import reports from 'src/app/mydata/reports';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { IReport } from 'src/app/mydata/api.service';

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
  data: IReport[] = [];
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

    this.reports = reports.slice(0, 20).map(({ title, createdBy, date, id }) => ({ title, createdBy, date, id }));
    this.data = reports.slice(pageSize * (currentPage-1), pageSize * currentPage).map(({ title, createdBy, date, id }) => ({ title, createdBy, date, id }));
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

  onStateButtonClick() {
    if (this.stateButtonDisabled) {
      return;
    }
    this.stateButtonDisabled = true;
    this.stateButtonCurrentState = 'show-spinner';
    setTimeout(() => {
      this.stateButtonCurrentState = 'show-success';
      setTimeout(() => {
        this.stateButtonCurrentState = '';
        this.stateButtonShowMessage = false;
        this.stateButtonDisabled = false;
      }, 2000);
    }, 1000);
  }

  onSearchKeyUp($event){
    this.searchKeyUp.emit($event);
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
