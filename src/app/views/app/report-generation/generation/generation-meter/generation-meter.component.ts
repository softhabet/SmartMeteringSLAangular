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
    this.step1.onSubmit();
  }

  submitStep2() {
    this.step2.getFilters();
  }

  ngOnInit(): void {
  }

}
