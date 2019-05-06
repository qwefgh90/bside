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
      this.state = map.get("state");
      this.code = map.get("code");
      this.oauth.makeAccessToken(this.state, this.code).then((value) => {
        console.log("Succeed to get accessToken");
        this.router.navigate(["/"]);
      }, (reason) =>{
        console.error("It fails to get access_token");
        this.router.navigate(["/login"]);
      })
    }else{
      this.router.navigate(["/login"]);
    }
  }


}
