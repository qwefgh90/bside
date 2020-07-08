import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterContentInit, ViewEncapsulation } from '@angular/core';
import { WrapperService, UserType, RepositoriesType } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { OAuthService } from 'src/app/oauth/service/o-auth.service';
import { Store, createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { selectQueryParam, State, selectRouteParam } from 'src/app/app-routing.reducer';
import * as fromRouter from '@ngrx/router-store';
@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  host: {'class': 'app-repositories'}
})
export class RepositoriesComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private wrapper: WrapperService, private router: Router, private store: Store<{}>) { }

  repositories: RepositoriesType;
  userId;
  searchInputFormControl = new FormControl();
  subscribtions: Array<Subscription> = []; 
  keyword;
  //synced
  user: UserType;

  ngOnInit() {
    let userSelector = (state: {app: AppState, router: fromRouter.RouterReducerState<any>}) => state.app.user;
    let userIdSelector = selectRouteParam('userId');
    let user$ = this.store.select(createSelector(userSelector, userIdSelector, (user, userId) => ({user, userId})));
    let s0 = user$.subscribe(({user, userId}) => {
      if (user && userId) {
        this.user = user;
        this.userId = userId;
        if (userId) {
          this.wrapper.repositories(this.userId).then((result) => {
            this.repositories = result;
          }, () => {
            console.error("Repositories can't be loaded.")
          });
        } else
          this.router.navigate(["repos", this.user.login]);
      }
    });
    this.searchInputFormControl.valueChanges.subscribe(v => {
      this.keyword = v;
    })
    this.subscribtions.push(s0);
  }

  ngAfterViewInit(){
  }

  ngOnDestroy(){
    this.subscribtions.forEach(s => s.unsubscribe());
  }

  getRepositories(){
    return this.repositories.filter(repo => {
      if(this.keyword == undefined)
        return true;
      if(this.keyword != undefined && (repo.name as string).toLocaleLowerCase().startsWith(this.keyword.toLocaleLowerCase())){
        return true;
      }
      return false;
    }).sort((a,b) => {
      if(a.updated_at < b.updated_at)
        return 1;
      else if(a.updated_at == b.updated_at)
        return 0;
      else
        return -1;
    });
  }

  repositoryToLoad = '';
  startLoading(repoName: string){
    this.repositoryToLoad = repoName;
  }
}
