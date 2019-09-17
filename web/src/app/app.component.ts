import { Component } from '@angular/core';
import { Route, ActivatedRoute, Router, ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'web';
  inWorkspace = false;
  cookieDisabled = false;
  constructor(private route: ActivatedRoute, private router: Router) {
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
    })
  }

  close(){
    localStorage.setItem('cookieDisabled', "1");
    this.cookieDisabled = true;
  }
}
