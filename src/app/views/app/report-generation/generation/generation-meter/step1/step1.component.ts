import {Component, OnInit} from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {requiredList} from './../custom.validators';
import { ReportService} from 'src/app/services/report.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html'
})
export class Step1Component implements OnInit {
  step1Form: FormGroup;

  constructor(private reportService: ReportService) {}

  public simpleList = [
    [], []
  ];

  ngOnInit(): void {
    this.reportService.getColumns(1).subscribe(
      (res) => {
        this.simpleList[0] = res;
      },
      (err) => {
        console.log(err);
      }
    );
    this.step1Form = new FormGroup({
      reportName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      reportDescription: new FormControl('', [Validators.required, Validators.minLength(2)]),
      separator: new FormControl('_', [Validators.required]),
      prefix: new FormControl('', [Validators.required]),
      timestamp: new FormControl('yyyyMMddHHmm', [Validators.required]),
      columns: new FormControl([]),
      checks: new FormGroup({
        compressed: new FormControl(false),
        timestamped: new FormControl(false)
      })
    });
    this.step1Form.controls.columns.setValidators([requiredList]);
  }

  onSubmit() {
    this.step1Form.value.columns = this.simpleList[1];
    console.log(this.step1Form.value);
    return this.step1Form.value;
  }

  public removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

}
