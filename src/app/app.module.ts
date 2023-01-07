import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';


import { AppComponent } from './app.component';
import { CreditCardComponentComponent } from './credit-card-component/credit-card-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponentComponent } from './file-upload-component/file-upload-component.component';
import { TetherfiNotilandComponent } from './tetherfi-notiland/tetherfi-notiland.component';

@NgModule({
  declarations: [
    AppComponent,
    CreditCardComponentComponent,
    FileUploadComponentComponent,
    TetherfiNotilandComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
