import { Component, OnInit, ViewChild } from '@angular/core';
import reports from 'src/app/mydata/reportsInstances';
import { InstanceService, IInstanceInfo, IInstanceListResponse } from 'src/app/services/instance.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextMenuComponent } from 'ngx-contextmenu';

@Component({
  selector: 'app-instancetable',
  templateUrl: './instance-table.component.html',
})
export class InstanceTableComponent implements OnInit {

  rows = reports.slice(0, 20).map(({ title, createdBy, date, id }) => ({ title, createdBy, date, id }));

  res: IInstanceListResponse[] = [];
  instancesList: IInstanceInfo[] = [];

  currentPage = 0;
  itemsPerPage = 10;
  itemOptionsPerPage = [5, 10, 20];
  totalItem = 0;
  totalPage = 0;

  type = '';
  searchName = '';
  reportName = '';

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  constructor(private instanceService: InstanceService, private notifications: NotificationsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.reportName = this.route.snapshot.paramMap.get('reportName');
    this.loadData(this.itemsPerPage, this.currentPage, this.searchName, this.reportName, this.type);
  }

  isNull(): boolean {
    return (this.reportName == null);
  }

  // get data paginated from back
  loadData(pageSize: number = 10, currentPage: number = 0, searchName: string = '', searchReport: string = '', type: string = '') {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage + 1;
    this.instanceService.getinstances(pageSize, currentPage, searchName, searchReport, type).subscribe(
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
    this.searchName = event.target.value.trim();
    this.loadData(this.itemsPerPage, 0, this.searchName, this.reportName, this.type);
  }

  changeTypeBy(type: any) {
    this.type = type;
    this.loadData(this.itemsPerPage, 0, this.searchName, this.reportName, this.type);
  }

  gotToReportGeneration() {
    this.router.navigate(['../report-generation/reports']);
  }

  onItemsPerPageChange(perPage: number) {
    this.itemsPerPage = perPage;
    this.loadData(this.itemsPerPage, 0, this.searchName, this.reportName, this.type);
  }

  pageChanged(event: any): void {
    this.currentPage = event.page - 1;
    this.loadData(this.itemsPerPage, this.currentPage, this.searchName, this.reportName, this.type);
  }

  // format date for table
  formatDate(date) {
    if (typeof date !== 'undefined') {
      const dates1 = date.split('+');
      const dates2 = dates1[0].split('.');
      return dates2[0].replace('T', ' ');
    }
  }

  // download file
  getDownload(data) {
    const fileName = data.headers.get('content-disposition')?.split(';')[1].split('=')[1];
    const blob: Blob = data.body as Blob;
    const link = document.createElement('a');
    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }

  // Set report size after downloading
  setReportSize(size: number, id: number) {
    this.instanceService.setInstanceSize(id, size).subscribe(
      (res) => {
        this.loadData(this.itemsPerPage, this.currentPage - 1, this.searchName, this.reportName, this.type);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // format report size in table
  formatReportSize(size: number): string {
    if (size === 0) {
      return 'NaN';
    } else if (size < 1000) {
      return (size + ' o');
    } else if (size >= 1000 && size < 1000000) {
      return (Math.trunc(size / 1000) + ' Ko');
    } else {
      return (Math.trunc(size / 1000000) + ' Mo');
    }
  }

  getBoolean(bool: boolean): string {
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

  compressedColor(scheduled) {
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

  onContextMenuClick(action: string, event) {
    if (action === 'csv') {
        this.instanceService.exportCSV(event.instanceId).subscribe(
          (res) => {
            this.getDownload(res);
            this.setReportSize(res.headers.get('content-length'), event.instanceId);
          },
          (err) => {
            console.log(err);
          }
        );
    } else if (action === 'pdf') {
      this.instanceService.exportPDF(event.instanceId).subscribe(
        (res) => {
          this.getDownload(res);
          this.setReportSize(res.headers.get('content-length'), event.instanceId);
        },
        (err) => {
          console.log(err);
        }
      );
    } else if (action === 'excel') {
      this.instanceService.exportExcel(event.instanceId).subscribe(
        (res) => {
          this.getDownload(res);
          this.setReportSize(res.headers.get('content-length'), event.instanceId);
        },
        (err) => {
          console.log(err);
        }
      );
    } else if (action === 'details') {
      this.router.navigateByUrl('app/report-generation/details/' + event.reportName);
    } else if (action === 'delete') {
      this.instanceService.deleteInstance(event.instanceId).subscribe(
        (res) => {
          console.log(res);
          const index = this.instancesList.indexOf(event);
          if (index > -1) {
            this.instancesList.splice(index, 1);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

}
