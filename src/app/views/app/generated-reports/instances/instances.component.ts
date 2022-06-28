import { Component, OnInit } from '@angular/core';
import { InstanceMsgService } from 'src/app/services/instanceMsg.service';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html'
})
export class InstancesComponent implements OnInit {

  constructor(private instanceMsg: InstanceMsgService) { }

  ngOnInit(): void {
    this.instanceMsg.changeMessage('');
  }

}
