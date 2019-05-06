import { Component, OnInit } from '@angular/core';
import { OAuthService } from '../oauth/service/o-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public oauth: OAuthService) { }

  ngOnInit() {
  }

}
