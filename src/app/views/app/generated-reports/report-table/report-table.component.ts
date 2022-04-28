import { Component, OnInit, ViewChild } from '@angular/core';
import reports from 'src/app/mydata/reportsInstances';
import { SelectionType } from '@swimlane/ngx-datatable';
import { InstanceService, IInstanceInfo, IInstanceListResponse } from 'src/app/services/instance.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { ContextMenuComponent } from 'ngx-contextmenu';

@Component({
  selector: 'app-reporttable',
  templateUrl: './report-table.component.html',
})
export class ReportTableComponent implements OnInit {

  rows = reports.slice(0, 20).map(({ title, createdBy, date, id }) => ({ title, createdBy, date, id }));

  res: IInstanceListResponse[] = [];
  instancesList: IInstanceInfo[] = [];

  currentPage = 0;
  itemsPerPage = 10;
  itemOptionsPerPage = [5, 10, 20];
  totalItem = 0;
  totalPage = 0;

  type = '';
  name = '';

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  constructor(private instanceService: InstanceService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit() {
    this.loadData(this.itemsPerPage, this.currentPage);
  }

    // get data paginated from back
  loadData(pageSize: number = 10, currentPage: number = 0, name: string = '', type: string = '') {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.instanceService.getinstances(pageSize, currentPage, name, type).subscribe(
      res => {
        this.instancesList = res.instancesList;
        // this.onDataEmpty(res.instancesList);
        this.totalItem = res.totalItems;
        this.totalPage = res.totalPages;
      },
      error => {
        console.log(error);
      }
    );
    }

  // pop up when no reports available
  onDataEmpty(list) {
    if (list.length === 0) {
      this.notifications.create('No report instances found !', 'No reports found with search parameters.', NotificationType.Error, { timeOut: 3000, showProgressBar: true });
    }
  }

  search(event) {
    this.name = event.target.value.toLowerCase().trim();
    this.loadData(this.itemsPerPage, 0, this.name, this.type);
  }

  changeTypeBy(type: any) {
    this.type = type;
    this.loadData(this.itemsPerPage, 0, this.name, this.type);
  }

  gotToReportGeneration() {
    this.router.navigate(['../report-generation/reports']);
  }

  onItemsPerPageChange(perPage: number) {
    this.itemsPerPage = perPage;
    this.loadData(this.itemsPerPage, 0, this.name, this.type);
  }

  pageChanged(event: any): void {
    this.loadData(this.itemsPerPage, event.page - 1, this.name, this.type);
  }

  // format date for table
  formatDate(date) {
    if (typeof date !== 'undefined') {
      const dates1 = date.split('+');
      const dates2 = dates1[0].split('.');
      return dates2[0].replace('T', ' ');
    }
  }

  onContextMenuClick(action: string, event) {
    if (action === 'delete') {
    } else if (action === 'details') {
    }
    console.log('onContextMenuClick -> action :  ', action, ', item.row :', event.instanceId);
  }

}
