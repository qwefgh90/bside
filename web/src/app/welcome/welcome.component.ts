import { Component, OnInit } from '@angular/core';
import { OAuthService } from '../oauth/service/o-auth.service';
import { WebWorkerEx } from '../worker/web-worker-ex';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(public oauth: OAuthService) { }

  ngOnInit() {
  }

}
