import { CommonService } from './../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Captcha } from '../interfaces/captcha.interface';

declare var document: any;

@Component({
  selector: 'app-captcha-component',
  templateUrl: './captcha-component.component.html',
  styleUrls: ['./captcha-component.component.scss'],
})
export class CaptchaComponentComponent implements OnInit {
  @ViewChild('carouselSliderContainer') carouselSliderContainer!: ElementRef;
  applicationConfig: any;
  captchaConfig: Captcha | any = undefined;
  captchaHeaderSourceContent!: string;
  captchaFooterSourceContent!: string;
  carouselContentArray: any = [];
  currentSliderIndex: number = 0;
  maxSliderIndex: number = 0;
  sliderIntervalFunction: any;

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private commonService: CommonService
  ) {
    this.captchaConfig = this.commonService.applicationConfig.captchaConfig;

    if (
      this.captchaConfig.captchaHeader.enable &&
      !this.captchaConfig.captchaHeader.pathToSource.includes('http')
    ) {
      this.http.get(this.captchaConfig.captchaHeader.pathToSource).subscribe((content: any) => {
        this.captchaHeaderSourceContent = content.captchaHeaderContent;
      });
    }

    if (
      this.captchaConfig.captchaFooter.enable &&
      !this.captchaConfig.captchaFooter.pathToSource.includes('http')
    ) {
      this.http.get(this.captchaConfig.captchaFooter.pathToSource).subscribe((content: any) => {
        this.captchaFooterSourceContent = content.captchaFooterContent;
      });
    }

    if (
      this.captchaConfig.captchaCarousel.enable &&
      this.captchaConfig.captchaCarousel.carouselContentPathArray.length
    ) {
      this.captchaConfig.captchaCarousel.carouselContentPathArray.forEach(
        (content: any, index: number) => {
          this.http.get(content).subscribe((carouselContent: any) => {
            this.carouselContentArray.push(carouselContent);
            this.maxSliderIndex = this.carouselContentArray.length;
            if (index == this.captchaConfig.captchaCarousel.carouselContentPathArray.length - 1)
              this.initSlider();
          });
        }
      );
    }
  }

  ngOnInit(): void {}

  initSlider() {
    if (this.carouselContentArray.length && this.captchaConfig.captchaCarousel.autoSlide.enable) {
      this.sliderIntervalFunction = setInterval(() => {
        if (this.currentSliderIndex != this.maxSliderIndex - 1) this.currentSliderIndex++;
        else this.currentSliderIndex = 0;
        this.renderer.setStyle(
          this.carouselSliderContainer.nativeElement,
          'transform',
          `translateX(-${this.currentSliderIndex * 100}%)`
        );
      }, this.captchaConfig.captchaCarousel.autoSlide.delay);
    }
  }

  onSwipe(direction: string) {
    clearInterval(this.sliderIntervalFunction);
    if (this.currentSliderIndex != this.maxSliderIndex - 1 && direction == 'left')
      this.currentSliderIndex++;
    else if (direction == 'right') {
      this.currentSliderIndex > 0
        ? this.currentSliderIndex--
        : (this.currentSliderIndex = this.maxSliderIndex - 1);
    } else this.currentSliderIndex = 0;
    this.renderer.setStyle(
      this.carouselSliderContainer.nativeElement,
      'transform',
      `translateX(-${this.currentSliderIndex * 100}%)`
    );
    this.initSlider();
  }

  checkForSecureProtocol(key: string): boolean {
    return (
      !this.captchaConfig.allowOnlySecureProtocolForSources ||
      (this.captchaConfig.allowOnlySecureProtocolForSources &&
        this.captchaConfig[key].pathToSource.includes('https'))
    );
  }
}
