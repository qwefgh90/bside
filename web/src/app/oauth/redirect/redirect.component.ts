import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from '../service/o-auth.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private oauth: OAuthService) { }
  state: string;
  code: string;
  
  ngOnInit() {
    let map = this.route.snapshot.queryParamMap;
    if(map.has("state") && map.has("code")){
      if (map.has("route")) {
        let url = map.get("route");
        console.log("RedirectUrl : " + url);
        this.oauth.redirectUrl = url;
      }
      this.state = map.get("state");
      this.code = map.get("code");

      this.oauth.login(this.state, this.code).then((value) => {
        console.log("success to login");
        if(this.oauth.redirectUrl != undefined){
          this.router.navigate([this.oauth.redirectUrl]);
          this.oauth.redirectUrl = undefined;
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
