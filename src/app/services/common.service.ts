import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  openParticipants: boolean = false;
  applicationConfig: any;

  constructor(private http: HttpClient) {}

  initConfig() {
    return new Promise<boolean>((resolve, reject) => {
      this.http.get('assets/app-config.json').subscribe((configData: any) => {
        this.applicationConfig = configData;
        resolve(true);
      });
    });
  }
}
