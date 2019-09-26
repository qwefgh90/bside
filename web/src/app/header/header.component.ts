import { Component, OnInit, OnDestroy } from '@angular/core';
import { OAuthService } from '../oauth/service/o-auth.service';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { WrapperService } from '../github/wrapper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(public oauth: OAuthService, private router: Router, private wrapperService: WrapperService, private activatedRoute: ActivatedRoute) {
  }

  subscriptions: Array<Subscription> = []

  isPrivate;
  user;
  redirecting = false;

  ngOnInit() {
    var s = this.oauth.channel.login.subscribe((isLogin) => {
      if(isLogin){
          this.wrapperService.user().then(user => {
            this.user = user;
          });
          
          this.wrapperService.scope().then(v => {
            this.isPrivate = (v == 'repo');
          })
      }else{
        this.user = undefined;
      }
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
