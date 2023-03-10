import { CommonService } from './../services/common.service';
import { OcrService } from './../services/ocr.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-credit-card-component',
  templateUrl: './credit-card-component.component.html',
  styleUrls: ['./credit-card-component.component.scss'],
})
export class CreditCardComponentComponent implements OnInit {
  @ViewChild('creditCardExpiry') creditCardExpiryEl!: ElementRef;
  @ViewChild('creditCardCvv') creditCardCvvEl!: ElementRef;
  @ViewChild('creditCardName') creditCardNameEl!: ElementRef;
  creditCardGroup!: FormGroup;
  creditCardType: string = 'MASTERCARD';
  creditcardConfig: any;
  controlIndex: number = 0;

  constructor(private ocrService: OcrService, private commonService: CommonService) {
    this.creditcardConfig = this.commonService.applicationConfig.creditCardComponent;

    this.creditCardGroup = new FormGroup({
      nameOnCard: new FormControl('', [Validators.required, Validators.minLength(5)]),
      cardNumber: new FormControl('', [Validators.required, Validators.minLength(19)]),
      cardExpiry: new FormControl('', [
        Validators.required,
        Validators.pattern('^(0[1-9]|1[0-2])/?([0-9]{2})$'),
      ]),
      cardCvv: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(3),
      ]),
    });
  }

  ngOnInit(): void {}

  autoProceedToNextControl() {
    switch (this.controlIndex) {
      case 0: {
        if (this.creditCardGroup.controls['cardNumber'].valid)
          this.creditCardExpiryEl.nativeElement.focus();
        break;
      }
      case 1: {
        if (this.creditCardGroup.controls['cardExpiry'].valid)
          this.creditCardCvvEl.nativeElement.focus();
        break;
      }
      case 2: {
        if (this.creditCardGroup.controls['cardCvv'].valid)
          this.creditCardNameEl.nativeElement.focus();
        break;
      }
    }
  }

  setControlIndex(index: number) {
    this.controlIndex = index;
  }

  findCreditCardType(cc: string) {
    let amex = new RegExp('^3[47][0-9]{13}$');
    let visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
    let cup1 = new RegExp('^62[0-9]{14}[0-9]*$');
    let cup2 = new RegExp('^81[0-9]{14}[0-9]*$');

    let mastercard = new RegExp('^5[1-5][0-9]{14}$');
    let mastercard2 = new RegExp('^2[2-7][0-9]{14}$');

    let disco1 = new RegExp('^6011[0-9]{12}[0-9]*$');
    let disco2 = new RegExp('^62[24568][0-9]{13}[0-9]*$');
    let disco3 = new RegExp('^6[45][0-9]{14}[0-9]*$');

    let diners = new RegExp('^3[0689][0-9]{12}[0-9]*$');
    let jcb = new RegExp('^35[0-9]{14}[0-9]*$');

    if (visa.test(cc)) {
      return 'VISA';
    }
    if (amex.test(cc)) {
      return 'AMEX';
    }
    if (mastercard.test(cc) || mastercard2.test(cc)) {
      return 'MASTERCARD';
    }
    if (disco1.test(cc) || disco2.test(cc) || disco3.test(cc)) {
      return 'DISCOVER';
    }
    if (diners.test(cc)) {
      return 'DINERS';
    }
    if (jcb.test(cc)) {
      return 'JCB';
    }
    if (cup1.test(cc) || cup2.test(cc)) {
      return 'CHINA_UNION_PAY';
    }
    return 'DEFAULT';
  }

  showProgressIndicator(controlName: string) {
    return this.creditCardGroup.controls[controlName].dirty;
  }

  validateControl(controlName: string) {
    return (
      (this.creditCardGroup.controls[controlName].touched &&
        this.creditCardGroup.controls[controlName].errors) ||
      (!this.creditCardGroup.controls[controlName].pristine &&
        this.creditCardGroup.controls[controlName].invalid)
    );
  }

  showSuccessIndicator(controlName: string) {
    return this.creditCardGroup.controls[controlName].valid;
  }

  showWarningIndicator(controlName: string) {
    return (
      this.creditCardGroup.controls[controlName].touched &&
      this.creditCardGroup.controls[controlName].invalid
    );
  }

  onExpiryInput(event: any) {
    event.target.value = event.target.value
      .replace(
        /^([1-9]\/|[2-9])$/g,
        '0$1/' // 3 > 03/
      )
      .replace(
        /^(0[1-9]|1[0-2])$/g,
        '$1/' // 11 > 11/
      )
      .replace(
        /^([0-1])([3-9])$/g,
        '0$1/$2' // 13 > 01/3
      )
      .replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
        '$1/$2' // 141 > 01/41
      )
      .replace(
        /^([0]+)\/|[0]+$/g,
        '0' // 0/ > 0 and 00 > 0
      )
      .replace(
        /[^\d\/]|^[\/]*$/g,
        '' // To allow only digits and `/`
      )
      .replace(
        /\/\//g,
        '/' // Prevent entering more than 1 `/`
      );
  }

  formatCreditCardNumber(event: any) {
    const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
    const onlyNumbers = event.target.value.replace(/[^\d]/g, '');

    event.target.value = onlyNumbers.replace(
      regex,
      (regex: any, $1: any, $2: any, $3: any, $4: any) =>
        [$1, $2, $3, $4].filter((group) => !!group).join(' ')
    );

    this.creditCardType = this.findCreditCardType(event.target.value.replaceAll(' ', ''));
  }

  async onFileUpload(fileData: any) {
    const res: any = await this.fileToBase64(fileData[0]);
    this.ocrService.recognizeImage(res).subscribe((response: any) => {
      console.log(response);
    });
  }

  fileToBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
}
