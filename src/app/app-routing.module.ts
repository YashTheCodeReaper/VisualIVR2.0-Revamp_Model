import { CaptchaComponentComponent } from './captcha-component/captcha-component.component';
import { SecurityComponentComponent } from './security-component/security-component.component';
import { FileUploadComponentComponent } from './file-upload-component/file-upload-component.component';
import { RecordVideoComponentComponent } from './record-video-component/record-video-component.component';
import { RecordAudioComponentComponent } from './record-audio-component/record-audio-component.component';
import { CreditCardComponentComponent } from './credit-card-component/credit-card-component.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'captchaPage',
    component: CaptchaComponentComponent,
  },
  {
    path: 'creditCard',
    component: CreditCardComponentComponent,
  },
  {
    path: 'recordAudio',
    component: RecordAudioComponentComponent,
  },
  {
    path: 'recordVideo',
    component: RecordVideoComponentComponent,
  },
  {
    path: 'fileUpload',
    component: FileUploadComponentComponent,
  },
  {
    path: 'security',
    component: SecurityComponentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
