import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-reports-list-page-header',
  templateUrl: './reports-list-page-header.component.html'
})
export class ReportsListPageHeaderComponent implements OnInit {

  @Input() showItemsPerPage = true;
  @Input() itemsPerPage = 10;
  @Input() itemOptionsPerPage = [5, 10, 20];

  @Output() itemsPerPageChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onChangeItemsPerPage(item) {
    this.itemsPerPageChange.emit(item);
  }

}
