import { Component, OnInit } from '@angular/core';
import { OAuthService } from '../oauth/service/o-auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  showFeature = true;
  
  constructor(public oauth: OAuthService) { }

  ngOnInit() {
  }

  toggle(){
    this.showFeature = !this.showFeature;
  }

}
