import { Component, OnInit } from '@angular/core';
import { WrapperService, UserType } from 'src/app/github/wrapper.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  host: {'class': 'app-user-profile'}
})
export class UserProfileComponent implements OnInit {

  //UI state
  user: UserType;

  constructor(private wrapperService: WrapperService) { }

  ngOnInit() {
    this.wrapperService.user().then(user => {
      this.user = user;
    });
  }
}
