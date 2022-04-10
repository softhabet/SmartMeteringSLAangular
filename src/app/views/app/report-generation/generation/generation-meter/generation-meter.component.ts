import { Component, OnInit, ViewChild } from '@angular/core';
import {Step1Component} from './step1/step1.component';
import {Step2Component} from './step2/step2.component';
import {Step3Component} from './step3/step3.component';

@Component({
  selector: 'app-generation-meter',
  templateUrl: './generation-meter.component.html'
})

export class GenerationMeterComponent implements OnInit {
  @ViewChild(Step1Component) step1: Step1Component;
  @ViewChild(Step2Component) step2: Step2Component;
  @ViewChild(Step3Component) step3: Step3Component;
  constructor() { }

  submitStep1() {
    return this.step1.onSubmit();
  }

  submitStep2() {
    return this.step2.getFilters();
  }

  getReportData() {
    return this.step3.onSubmit();
    // const step1 = this.submitStep1();
    // const step2 = this.submitStep2();
    // console.log(step1.concat(step2));
    // return step1.concat(step2);
  }

  ngOnInit(): void {
  }

}
