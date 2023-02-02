import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Captcha } from '../interfaces/captcha.interface';

@Component({
  selector: 'app-captcha-component',
  templateUrl: './captcha-component.component.html',
  styleUrls: ['./captcha-component.component.scss'],
})
export class CaptchaComponentComponent implements OnInit {
  applicationConfig: any;
  captchaConfig!: Captcha | any;
  captchaHeaderSourceContent!: string;

  constructor(private http: HttpClient) {
    this.captchaConfig = {
      allowOnlySecureProtocolForSources: false,
      captchaHeader: {
        enable: true,
        position: 'normal',
        pathToSource: 'assets/html/captcha/captcha-header.json',
      },
      captchaCrousel: {
        enable: true,
        position: {
          landscape: 'left',
          portrait: 'top',
        },
      },
      formPosition: 'center',
      captchaLogo: {
        enable: true,
        pathToSource: 'assets/images/captcha/changi.webp',
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
      captchaFooter: {
        enable: true,
        pathToSource: 'assets/html/captcha/captcha-footer.html',
      },
    };

    if (
      this.captchaConfig.captchaHeader.enable &&
      !this.captchaConfig.captchaHeader.pathToSource.includes('http')
    ) {
      this.http.get(this.captchaConfig.captchaHeader.pathToSource).subscribe((content: any) => {
        this.captchaHeaderSourceContent = content.captchaHeaderContent;
      });
    }
  }

  ngOnInit(): void {}

  checkForSecureProtocol(key: string): boolean {
    return (
      !this.captchaConfig.allowOnlySecureProtocolForSources ||
      (this.captchaConfig.allowOnlySecureProtocolForSources &&
        this.captchaConfig[key].pathToSource.includes('https'))
    );
  }
}
