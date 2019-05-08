import { Component, OnInit, OnDestroy } from '@angular/core';
import { OAuthService } from '../oauth/service/o-auth.service';
import { Router } from '@angular/router';
import { WrapperService } from '../github/wrapper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private oauth: OAuthService, private router: Router, private wrapperService: WrapperService) {
  }

  subscriptions: Array<Subscription> = []

  user;

  ngOnInit() {
    var s = this.oauth.channel.login.subscribe((isLogin) => {
      console.log("::" + isLogin);
      if(isLogin){
         this.wrapperService.user().then(user => {
           this.user = user;
         });
      }
    });
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
