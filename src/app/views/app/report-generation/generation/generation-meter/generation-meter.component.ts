import { Component, OnInit, ViewChild } from '@angular/core';
import {Step1Component} from './step1/step1.component';

@Component({
  selector: 'app-generation-meter',
  templateUrl: './generation-meter.component.html'
})

export class GenerationMeterComponent implements OnInit {
  @ViewChild(Step1Component) step1: Step1Component;
  constructor() { }

  submitStep1(){
    this.step1.onSubmit();
    console.log('aaaa');
  }

  ngOnInit(): void {
  }

}
