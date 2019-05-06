import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }
  state: string;
  code: string;
  
  ngOnInit() {
    let map = this.route.snapshot.queryParamMap;
    if(map.has("state") && map.has("code")){
      this.state = map.get("state");
      this.code = map.get("code");
    }else{
      this.router.navigate(["/login"]);
    }
  }


}
