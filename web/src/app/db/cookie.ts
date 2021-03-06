import { InjectionToken } from '@angular/core';

let cookie: Cookie = {autoLogin: false, includingPrivate: false, accessToken: undefined};
export let CookieToken = new InjectionToken<Cookie>( "Cookie token" , {
    providedIn: 'root',
    factory: () => cookie
  });

export interface Cookie {
    autoLogin: boolean;
    includingPrivate: boolean;
    accessToken?: string;
}
