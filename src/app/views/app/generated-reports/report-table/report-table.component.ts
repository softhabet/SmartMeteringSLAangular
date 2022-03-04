import { Component, OnInit, ViewChild } from '@angular/core';
import reports from 'src/app/mydata/reports';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-reporttable',
  templateUrl: './report-table.component.html',
})
export class ReportTableComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = reports.slice(0, 20).map(({ title, createdBy, date, id }) => ({ title, createdBy, date, id }));

  columns = [
    { prop: 'title', name: 'Title' },
    { prop: 'createdBy', name: 'Created By' },
    { prop: 'date', name: 'Date' },
    { prop: 'id', name: 'Id' }
  ];
  ColumnMode = ColumnMode;
  temp = [...this.rows];
  itemsPerPage = 10;
  itemOptionsPerPage = [5, 10, 20];
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';

  constructor() { }

  ngOnInit() {
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase().trim();
    const count = this.columns.length;
    const keys = Object.keys(this.temp[0]);
    const temp = this.temp.filter(item => {
      for (let i = 0; i < count; i++) {
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(val) !== -1) || !val) {
          return true;
        }
      }
    });
    this.rows = temp;
    this.table.offset = 0;
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

  selectAllChange($event) {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onItemsPerPageChange(itemCount) {
    this.itemsPerPage = itemCount;
  }

}