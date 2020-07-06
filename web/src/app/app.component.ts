import { Component, ViewEncapsulation } from '@angular/core';
import { Route, ActivatedRoute, Router, ActivationEnd, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AnalyticsService } from './analytics/analytics.service';

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
  constructor(private route: ActivatedRoute, private router: Router, private analytics: AnalyticsService) {
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
