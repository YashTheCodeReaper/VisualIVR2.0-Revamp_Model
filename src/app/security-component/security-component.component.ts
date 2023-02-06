import { CommonService } from './../services/common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-security-component',
  templateUrl: './security-component.component.html',
  styleUrls: ['./security-component.component.scss'],
})
export class SecurityComponentComponent implements OnInit {
  securityConfig: any;

  constructor(private commonService: CommonService) {
    this.securityConfig = this.commonService.applicationConfig.securityComponent;
  }

  ngOnInit(): void {}

  onSeparatedInputFocus(index: number) {
    const element: any = document.getElementById(`securitySeparatedInput${index}`);
    const nextElement: any = document.getElementById(`securitySeparatedInput${index + 1}`);
    if (element && element.value.length) {
      nextElement.focus();
    }
  }
}
