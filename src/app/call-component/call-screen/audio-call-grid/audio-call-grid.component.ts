import { CommonService } from './../../../services/common.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-audio-call-grid',
  templateUrl: './audio-call-grid.component.html',
  styleUrls: ['./audio-call-grid.component.scss']
})
export class AudioCallGridComponent {
  sourceCount: number = 6;

  constructor(public commonService: CommonService){}
}
