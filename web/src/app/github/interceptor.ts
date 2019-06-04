import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor() { }

    private etagMap = new Map<string, string>();
    private cacheMap = new Map<string, HttpResponse<any>>();

    private getKey(req: HttpRequest<any>) {
        return req.url + req.params.toString();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        let wrapperReq: HttpRequest<any>;
        if ((req.method.toLowerCase() == "get") && this.etagMap.has(this.getKey(req))) {
            wrapperReq = req.clone({ headers: req.headers.set('If-None-Match', this.etagMap.get(this.getKey(req))) }); //use ETag
        } else {
            wrapperReq = req;
        }
        return next.handle(wrapperReq).pipe(map(
            event => {
                if (event instanceof HttpResponse) {
                    const response = (event as HttpResponse<any>);
                    if (response.headers.has('ETag') && (wrapperReq.method.toLowerCase() == "get") && response.ok) {
                        let etag = response.headers.get('ETag');
                        this.etagMap.set(this.getKey(req), etag);   //update ETag 
                        this.cacheMap.set(this.getKey(req), response); //update the response
                        console.debug(`add etag(${etag}) to ${req.url}`);
                    }
                }
                return event;
            }
        ), catchError((event, c) => {
            if (event instanceof HttpErrorResponse) {
                const response = (event as HttpErrorResponse);
                if (response.headers.has('ETag') && (wrapperReq.method.toLowerCase() == "get") && response.status == 304 && (this.cacheMap.has(this.getKey(req)))) {
                    console.debug(`response the cache of ${req.url}`);
                    const cachedRes = this.cacheMap.get(this.getKey(req)); //user the cached response
                    event = cachedRes;
                }
            }
            return of(event);
        }));
    }
}