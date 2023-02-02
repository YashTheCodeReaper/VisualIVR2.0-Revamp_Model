import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  openParticipants: boolean = false;

  constructor() { }
}
