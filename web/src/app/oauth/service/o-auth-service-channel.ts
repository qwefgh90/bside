import { Observable, Subject } from 'rxjs';

export class OAuthServiceChannel {
    get login(): Observable<boolean>{
        return this._login.asObservable();
    }
    constructor(private _login: Subject<boolean>){
        // this.login = login.asObservable();
    }
}
