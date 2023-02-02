import { CommonService } from './../../../services/common.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent {
  constructor(public commonService: CommonService){}

  onParticipantsClose(){
    this.commonService.openParticipants = false;
  }
}
