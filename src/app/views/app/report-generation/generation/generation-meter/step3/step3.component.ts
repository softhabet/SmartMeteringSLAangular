import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsLocaleService} from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html'
})
export class Step3Component implements OnInit {

  // DatePicker + timePicker
  form: FormGroup;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  mouseTime1 = new Date();
  mouseTime2 = new Date();

  bsInlineValue = new Date();

  @Input() value: string;

  public scheduled: boolean = false;

  constructor(private localeService: BsLocaleService) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];

    //defined frensh local date
    defineLocale('fr', frLocale);
    this.localeService.use('fr');
   }

  ngOnInit(): void {
    this.form = new FormGroup({
      basicDate: new FormControl(new Date()),
    });
  }

  choose( check : boolean ): void {
    this.scheduled=check;
  }

}
