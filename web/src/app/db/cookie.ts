import { InjectionToken } from '@angular/core';

export let CookieToken = new InjectionToken<Cookie>( "Cookie token" );

export interface Cookie {
    autoLogin: boolean;
    includingPrivate: boolean;
}
