import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from '../service/o-auth.service';
import { TextUtil } from 'src/app/workspace/text/text-util';
import { createFeatureSelector, select, Store } from '@ngrx/store';
import { AuthState, authReducerKey } from '../auth.reducer';
import { redirectUrlChanged } from '../auth.actions';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  //cache with ngrx
  redirectUrl = '';
  
  constructor(private route: ActivatedRoute, private router: Router, public oauth: OAuthService, private store: Store<{}>) { 
    let authSelector = createFeatureSelector<any, AuthState>(authReducerKey);
    let authState = store.pipe(select(authSelector));
    authState.subscribe(state => {
        this.redirectUrl = state.redirectUrl;
    });
  }

  state: string;
  code: string;
  
  ngOnInit() {
    let map = this.route.snapshot.queryParamMap;
    if(map.has("state") && map.has("code")){
      if (map.has("route")) {
        let url = map.get("route");
        console.log("RedirectUrl : " + url);
        this.store.dispatch(redirectUrlChanged({redirectUrl: TextUtil.base64ToString(url)}));
      }
      this.state = map.get("state");
      this.code = map.get("code");

      this.oauth.login(this.state, this.code).then((value) => {
        console.log("success to login");
        if(this.redirectUrl != undefined){
          this.router.navigateByUrl(this.redirectUrl);
        }else
          this.router.navigate(["/"]);
      }, (reason) =>{
        console.error("It fails to get access_token");
        this.router.navigate(["/login"]);
      });
    }else{
      this.router.navigate(["/login"]);
    }
  }


}
