import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonacoService {
  public loaded = new ReplaySubject<void>(1);
  constructor() { }
}
