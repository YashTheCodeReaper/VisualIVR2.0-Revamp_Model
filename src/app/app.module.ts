import { CommonService } from './services/common.service';
import { AppRoutingModule } from './app-routing.module';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { CreditCardComponentComponent } from './credit-card-component/credit-card-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponentComponent } from './file-upload-component/file-upload-component.component';
import { TetherfiNotilandComponent } from './tetherfi-notiland/tetherfi-notiland.component';
import { RecordAudioComponentComponent } from './record-audio-component/record-audio-component.component';
import { CallComponentComponent } from './call-component/call-component.component';
import { ConnectingViewComponent } from './call-component/connecting-view/connecting-view.component';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { CallScreenComponent } from './call-component/call-screen/call-screen.component';
import { CallControlsComponent } from './call-component/call-screen/call-controls/call-controls.component';
import { AudioCallGridComponent } from './call-component/call-screen/audio-call-grid/audio-call-grid.component';
import { CallElementComponent } from './call-component/call-screen/call-element/call-element.component';
import { ParticipantsComponent } from './call-component/call-screen/participants/participants.component';
import { HttpClientModule } from '@angular/common/http';
import { CaptchaComponentComponent } from './captcha-component/captcha-component.component';
import { SafePipeModule } from 'safe-pipe';
import { SecurityComponentComponent } from './security-component/security-component.component';
import { RecordVideoComponentComponent } from './record-video-component/record-video-component.component';
import { HomeComponent } from './home/home.component';

export function initConfig(commonService: CommonService){
  return async () => await commonService.initConfig()
}

@NgModule({
  declarations: [
    AppComponent,
    CreditCardComponentComponent,
    FileUploadComponentComponent,
    TetherfiNotilandComponent,
    RecordAudioComponentComponent,
    CallComponentComponent,
    ConnectingViewComponent,
    ChatContainerComponent,
    CallScreenComponent,
    CallControlsComponent,
    AudioCallGridComponent,
    CallElementComponent,
    ParticipantsComponent,
    CaptchaComponentComponent,
    SecurityComponentComponent,
    RecordVideoComponentComponent,
    HomeComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SafePipeModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [CommonService],
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
