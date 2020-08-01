import { Component, OnInit, OnDestroy } from '@angular/core';
import { OAuthService } from '../oauth/service/o-auth.service';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { WrapperService } from '../github/wrapper.service';
import { Subscription } from 'rxjs';
import { Store, createFeatureSelector, select, createSelector, State } from '@ngrx/store';
import { AuthState, authReducerKey } from '../oauth/auth.reducer';
import { AppState } from '../app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(public oauth: OAuthService, private router: Router, private store: Store<{}>) {
  }

  subscriptions: Array<Subscription> = []

  //state synced
  isPrivate;
  user;
  isLogin = false;
  //local ui state
  redirecting = false;
  ngOnInit() {
    let authSelector = createFeatureSelector<any, AuthState>(authReducerKey);
    let userSelector = (state: {app: AppState}) => state.app.user;
    let user$ = this.store.select(createSelector(userSelector, authSelector, (user, auth) => ({user, isLogin: auth.isLogin, isPrivate: auth.isPrivate})));
    var s = user$.subscribe(({user, isLogin, isPrivate}) => {
      this.user = user;
      this.isLogin = isLogin;
      this.isPrivate = isPrivate;
    });
    this.subscriptions.push(s);
    s = this.router.events.subscribe(e =>{
      if(e instanceof NavigationStart){
        let navi = e as NavigationStart;
        if(navi.url.startsWith("/redirect")){
          this.redirecting = true;
        }else{
          this.redirecting = false;
        }
      }
    })
    this.subscriptions.push(s);
  }

  logout(){
    this.oauth.logout().then(() => {
      this.router.navigate(["/"]);
    });
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
