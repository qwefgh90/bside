import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from '../service/o-auth.service';
import { TextUtil } from 'src/app/workspace/text/text-util';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, public oauth: OAuthService) { }
  state: string;
  code: string;
  
  ngOnInit() {
    let map = this.route.snapshot.queryParamMap;
    if(map.has("state") && map.has("code")){
      if (map.has("route")) {
        let url = map.get("route");
        console.log("RedirectUrl : " + url);
        this.oauth.redirectUrl = TextUtil.base64ToString(url);
      }
      let isPrivate = false;
      if (map.has("private")) {
        isPrivate = map.get("private") == "true";
      }
      this.state = map.get("state");
      this.code = map.get("code");

      this.oauth.login(this.state, this.code).then((value) => {
        console.log("success to login");
        if(this.oauth.redirectUrl != undefined){
          this.router.navigateByUrl(this.oauth.redirectUrl);
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
