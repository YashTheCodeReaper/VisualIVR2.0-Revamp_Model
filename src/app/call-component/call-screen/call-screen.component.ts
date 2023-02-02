import { CommonService } from './../../services/common.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-call-screen',
  templateUrl: './call-screen.component.html',
  styleUrls: ['./call-screen.component.scss']
})
export class CallScreenComponent {
  constructor(public commonService: CommonService){}
}
