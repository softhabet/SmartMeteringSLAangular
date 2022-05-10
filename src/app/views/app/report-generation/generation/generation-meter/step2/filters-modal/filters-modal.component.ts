import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from 'src/app/services/filter.service';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html'
})
export class FiltersModalComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Output() passSelected: EventEmitter<any> = new EventEmitter();

  selected: any[] = [];
  SelectionType = SelectionType;
  selectAllState = '';
  title: string;
  closeBtnName: string;
  list: any[] = [];
  columns: any[] = [];
  rows: any[] = [];

  constructor(private filterService: FilterService, public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.filterService.getFilters().subscribe(
      (res) => {
        this.rows = res as Array<object>;
        console.log(this.rows);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkIfDate(timestampString: string): boolean {
    if (!this.checkIfDateRange(timestampString)) {
      const timestamp = parseInt(timestampString, 10);
      return (new Date(timestamp * 1000)).getTime() > 0;
    } else {
      return false;
    }

  }

  checkIfDateRange(timestampList: string): boolean {
    if (timestampList.includes(',')) {
      const timestamp = parseInt(timestampList.split(',')[0] , 10);
      return (new Date(timestamp * 1000)).getTime() > 0;
    } else {
      return false;
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

  DateToString(date) {
    const string = date.toString();
    if (string.length === 1) {
      return ('0' + string);
    } else {
      return string;
    }
  }

  getDateRange(value: string): string {
    const dates = value.split(',');
    return (this.formatTimestamp(parseInt(dates[0], 10)) + '\r\n' + this.formatTimestamp(parseInt(dates[1], 10)));
  }

  sendSelectedFilters(selected) {
    this.passSelected.emit(this.selected);
    this.bsModalRef.hide();
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.setSelectAllState();
  }

  setSelectAllState() {
    if (this.selected.length === this.rows.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

}
