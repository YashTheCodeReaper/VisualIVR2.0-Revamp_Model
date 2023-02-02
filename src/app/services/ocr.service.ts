import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OcrService {
  ocrServiceApiUrl: string = 'http://localhost:3000/recognizeImage';
  constructor(private http: HttpClient) {}

  recognizeImage(imageData: string): Observable<any> {
    return this.http.post(`${this.ocrServiceApiUrl}`, { imageData: imageData });
  }
}
