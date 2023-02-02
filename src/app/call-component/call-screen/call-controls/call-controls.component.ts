import { CommonService } from './../../../services/common.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-call-controls',
  templateUrl: './call-controls.component.html',
  styleUrls: ['./call-controls.component.scss'],
})
export class CallControlsComponent {
  autoHideInterval: any;
  hideControlBar: boolean = false;
  hoverOnControlBar: boolean = false;
  enableFloaterControlBar: boolean = true;

  constructor(public commonService: CommonService) {
    setTimeout(() => {
      if(this.enableFloaterControlBar) this.hideControlBar = true;
    }, 5000);

    document.body.addEventListener('mousemove', (e) => {
      e.preventDefault();
      if (this.enableFloaterControlBar) {
        this.hideControlBar = false;
        clearTimeout(this.autoHideInterval);
        if (!this.hoverOnControlBar)
          this.autoHideInterval = setTimeout(() => {
            this.hideControlBar = true;
          }, 5000);
      }
    });
  }

  toggleFloaterControlBar(){
    this.enableFloaterControlBar = !this.enableFloaterControlBar;
  }

  onControlFloaterMouseHover() {
    this.hoverOnControlBar = !this.hoverOnControlBar;
  }

  onParticipantsClick(){
    this.commonService.openParticipants = true;
  }
}
