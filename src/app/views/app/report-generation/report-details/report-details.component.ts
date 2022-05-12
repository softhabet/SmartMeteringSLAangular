import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from 'src/app/services/report.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html'
})
export class ReportDetailsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = ColumnMode;

  reportName = '';
  reportDetails: any[];
  rows = [
    {field : 'Report Name', info : null},
    {field : 'Report Type', info : null},
    {field : 'Owner', info : null},
    {field : 'Report Description', info : null},
    {field : 'Report File Name', info : null},
    {field : 'Compressed export', info : null},
    {field : 'Timestamped Folder', info : null},
    {field : 'Scheduled', info : null},
    {field : 'Status', info : null},
    {field : 'Schedule Start', info : null},
    {field : 'Schedule End', info : null},
    {field : 'Schedule Every', info : null},
    {field : 'Select Columns', info : null},
    {field : 'Filters', info : null},
    {field : 'Creation Date', info : null},
  ];
  columns = [
    { prop: 'field', name: 'Field' },
    { prop: 'info', name: 'Info' }
  ];
  prefix: string;
  separator: string;
  randomId: string;
  timestamp: string;
  reportType: string;

  isScheduled: boolean;

  constructor(private reportService: ReportService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.reportName = this.route.snapshot.paramMap.get('reportName');
    this.loadData(this.reportName);
  }

  loadData(reportName) {
    this.reportService.getReportDetails(reportName).subscribe(
      (res) => {
        this.reportDetails = res;
        for (const [k, v] of Object.entries(res)) {
          if (k === 'reportName') {
            this.rows[0].info = v as string;
          } else if (k === 'reportType') {
            this.rows[1].info = v as string;
            this.reportType = v as string;
          } else if (k === 'userName') {
            this.rows[2].info = v as string;
          } else if (k === 'reportDescription') {
            this.rows[3].info = v as string;
          } else if (k === 'isCompressedExport') {
            this.rows[5].info = this.formatBoolean(v as boolean);
          } else if (k === 'isTimeStampedFolder') {
            this.rows[6].info = this.formatBoolean(v as boolean);
          } else if (k === 'isScheduled') {
            this.rows[7].info = this.formatBoolean(v as boolean);
          } else if (k === 'prefix') {
            this.prefix = v as string;
          } else if (k === 'separator') {
            this.separator = v as string;
          } else if (k === 'randomId') {
            this.randomId = v as string;
          } else if (k === 'timestamp') {
            this.timestamp = v as string;
          }
          this.rows[4].info = this.setReportFileName(this.prefix, this.separator, this.randomId, this.timestamp, this.reportType);
          this.rows = [...this.rows];
        }
        if (res.isScheduled) {
          this.isScheduled = true;
          for (const [k, v] of Object.entries(res)) {
            if (k === 'status') {
              this.rows[8].info = v as string;
            } else if (k === 'scheduleStart') {
              this.rows[9].info = this.formatDate(v as string);
            } else if (k === 'scheduleEnd') {
              this.rows[10].info = this.formatDate(v as string);
            } else if (k === 'scheduleEvery') {
              this.rows[11].info = this.getScheduelEvery(v as number);
            } else if (k === 'selectedColumns') {
              this.rows[12].info = v as Array<object>;
            } else if (k === 'filters') {
              this.rows[13].info = v as Array<object>;
            } else if (k === 'creationDate') {
              this.rows[14].info = this.formatDate(v as string);
            }
            this.rows = [...this.rows];
          }
        } else {
          this.isScheduled = false;
          this.rows.splice(8, 1);
          this.rows.splice(9, 1);
          this.rows.splice(10, 1);
          this.rows.splice(11, 1);
          this.rows = [...this.rows];
          for (const [k, v] of Object.entries(res)) {
            if (k === 'selectedColumns') {
              this.rows[8].info = v as Array<object>;
            } else if (k === 'filters') {
              this.rows[9].info = v as Array<object>;
            } else if (k === 'creationDate') {
              this.rows[10].info = this.formatDate(v as string);
            }
            this.rows = [...this.rows];
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setReportFileName(prefix, separator, randomId, timestamp, reportType): string {
    if (randomId == null || randomId === '') {
      return prefix + separator + reportType + separator + timestamp;
    } else {
      return prefix + separator + reportType + separator + timestamp + separator + randomId;
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

  formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    return (year.toString() + '-' + this.DateToString(month) + '-' + this.DateToString(day) + ' ' + this.DateToString(hour) + ':' + this.DateToString(min));
  }

  formatBoolean(bool) {
    if (bool) {
      return 'YES';
    } else {
      return 'NO';
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

  checkValue(value): string {
    if (Array.isArray(value)) {
      if (typeof value[0] === 'object' && value[0] !== null) {
        if (value[0].hasOwnProperty('columnId')) {
          return 'columns';
        } else if (value[0].hasOwnProperty('filterId')) {
          return 'filters';
        } else {
          return 'error';
        }
      }
    } else {
      return 'string';
    }
  }

  // to remove scheduled rows when report is not scheduled : it returns false when row needs to be removed
  checkScheduled(scheduled: boolean, value: string): boolean {
    if (!scheduled) {
      if (value === 'Status') {
        return false;
      } else if (value === 'Schedule Start') {
        return false;
      } else if (value === 'Schedule End') {
        return false;
      } else if (value === 'Schedule Every') {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  getDateRange(value: string): string {
    const dates = value.split(',');
    return ('From: ' + this.formatTimestamp(dates[0]) + ' To: ' + this.formatTimestamp(dates[1]));
  }

  getScheduelEvery(time: number): string {
    if (time / 2628000 >= 1) {
      return (Math.trunc(time / 2628000) + ' Months');
    } else if (time / 604800 >= 1) {
      return (Math.trunc(time / 604800) + ' Weeks');
    } else if (time / 86400 >= 1) {
      return (Math.trunc(time / 86400) + ' Days');
    } else {
      const hours = time / 3600;
      const minutes = (time - Math.trunc(hours) * 3600) / 60;
      return (Math.trunc(hours) + ' hours' + ' ' + Math.trunc(minutes) + ' minutes');
    }
  }

}
