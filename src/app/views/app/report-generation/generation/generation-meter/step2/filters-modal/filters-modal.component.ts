import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html'
})
export class FiltersModalComponent implements OnInit {

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService, private translateService: TranslateService) { }

  openModalWithComponent() {
    const initialState = {
      list: [
        '...',
        '..'
      ],
      // title: this.translateService.instant('modal.modal-title')
      title: 'Filters'
    };
    this.bsModalRef = this.modalService.show(FilterModalComponent, { initialState, class: 'modal-dialog-centered modal-lg' });
    this.bsModalRef.content.closeBtnName = this.translateService.instant('modal.close');
  }

  ngOnInit(): void {
  }

}
