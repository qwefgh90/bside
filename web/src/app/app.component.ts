import { Component, ViewEncapsulation } from '@angular/core';
import { Route, ActivatedRoute, Router, ActivationEnd, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AnalyticsService } from './analytics/analytics.service';
import { WrapperService } from './github/wrapper.service';
import { createFeatureSelector, select, Store } from '@ngrx/store';
import { authReducerKey, AuthState } from './oauth/auth.reducer';
import { updateUserInformation } from './app.actions';
import { AppState } from './app.reducer';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'web';
  inWorkspace = false;
  cookieDisabled = false;
  isDesktop = false;
  constructor(private route: ActivatedRoute, private router: Router, private analytics: AnalyticsService, private wrapper: WrapperService
    , private store: Store<{app: AppState}>
    , private detector: DeviceDetectorService) {
    let selector = createFeatureSelector<any, AuthState>(authReducerKey);
    let accessToken$ = this.store.select(selector);
    accessToken$.subscribe(({isLogin, accessToken}: AuthState) => {
      if(isLogin && accessToken){
        this.wrapper.user().then((user) => {
          this.store.dispatch(updateUserInformation({user}));
        });
      }
    });
    if(localStorage.getItem('cookieDisabled') == "1"){
      this.cookieDisabled = true;
    }
    router.events.subscribe((e) => {
      if (e instanceof ActivationEnd) {
        let route = e.snapshot.routeConfig;
        if (route.component != undefined) {
          if (route.path == ':userId/:repositoryName')
            this.inWorkspace = true;
          else
            this.inWorkspace = false;
          this.isDesktop = detector.isDesktop();
        }
      }
      
      if (e instanceof NavigationEnd) {
        if(!this.inWorkspace){
          this.analytics.visit(e.urlAfterRedirects);
        }
      }
    })
  }

  close(){
    localStorage.setItem('cookieDisabled', "1");
    this.cookieDisabled = true;
  }
}
