import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonacoService {
  public monaco = new ReplaySubject<any>(1);
  constructor() { }
}