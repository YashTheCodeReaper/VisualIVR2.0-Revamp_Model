import { CommonService } from './services/common.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vivr2.0-revamp';

  constructor(private commonService: CommonService){}
}
