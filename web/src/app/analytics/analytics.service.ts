import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare let gtag: Function;

export let whiteList: string[] = [];

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }
  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null) {
    gtag('event', eventName, {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    })
  }

  public visit(url: string) {
    gtag('config', environment.targetId,
      {
        'page_path': url
      }
    );
  }
}
