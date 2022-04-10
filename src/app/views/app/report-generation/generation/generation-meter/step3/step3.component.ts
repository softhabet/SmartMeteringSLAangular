import { Component, Input, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsLocaleService} from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import {timeRequired} from './../custom.validators';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html'
})
export class Step3Component implements OnInit {

  // DatePicker + timePicker
  generationForm: FormGroup;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  mouseTime1 = new Date();
  mouseTime2 = new Date();
  mouseTime3 = new Date();

  bsInlineValue = new Date();

  @Input() value: string;

  public scheduled = false;

  reportType: [false, true];

  constructor(private localeService: BsLocaleService) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];

    // defined frensh local date
    defineLocale('fr', frLocale);
    this.localeService.use('fr');
   }

  ngOnInit(): void {
    this.generationForm = new FormGroup({
      radio: new FormControl('false', [Validators.required]),
      scheduledDate: new FormControl(null, [Validators.required]),
      timeFrom: new FormControl(null, [timeRequired()]),
      timeTo: new FormControl(null, [timeRequired()]),
      timeEvery: new FormControl(null, [timeRequired()])
    });
  }

  onSubmit() {
    console.log(this.generationForm.value);
  }

  choose( check: boolean ): void {
    this.scheduled = check;
  }

}
