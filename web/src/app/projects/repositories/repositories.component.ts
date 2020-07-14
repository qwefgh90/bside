import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterContentInit, ViewEncapsulation } from '@angular/core';
import { WrapperService, UserType, RepositoriesType, RepositoryType } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { OAuthService } from 'src/app/oauth/service/o-auth.service';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { selectQueryParam, State, selectRouteParam, selectCurrentRoute } from 'src/app/app-routing.reducer';
import * as fromRouter from '@ngrx/router-store';
import { projectsRoutes } from '../projects-routing.module'
import { projectsReducerKey, ProjectsState } from '../projects.reducer';
import { addBookmark, removeBookmark } from '../projects.actions';
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
  bookmarkMap = new Map<string, boolean>();
  bookmarkList: Set<string>;
  selectedOptionForSorting = new FormControl("Updated");
  Updated ="Updated";
  Edited ="Edited"

  ngOnInit() {
    let userSelector = (state: {app: AppState, router: fromRouter.RouterReducerState<any>}) => state.app.user;
    let featureKey = createFeatureSelector(projectsReducerKey)
    let bookmarkListSelector = createSelector(featureKey, (state: ProjectsState) => state.bookmarkList);
    let userIdSelector = selectRouteParam('userId');
    let user$ = this.store.select(createSelector(userSelector, userIdSelector, selectCurrentRoute, (user, userId, route: {children,data,firstChild,fragment,outlet,params,queryParams,routeConfig: {path, pathMatch, redirectTo},url: []}) => ({user, userId, route})));
    let s0 = user$.subscribe(({user, userId, route}) => {
      if (projectsRoutes.find(r => r.path == route.routeConfig.path) 
            && user) {
        this.user = user;
        if (userId) {
          this.userId = userId;
          this.wrapper.repositories(this.userId).then((result) => {
            this.repositories = result;
            this.repositories = this.getSortedRepositories();
          }, () => {
            console.error("Repositories can't be loaded.")
          });
        } else
          this.router.navigate(["repos", this.user.login]);
      }
    });
    let s1 = this.store.select(bookmarkListSelector).subscribe(bookmarkList => {
      this.bookmarkList = new Set(bookmarkList);
      this.repositories = this.getSortedRepositories();
    });
    this.searchInputFormControl.valueChanges.subscribe(v => {
      this.keyword = v;
    })
    this.subscribtions.push(s0, s1);
  }

  ngAfterViewInit(){
  }

  ngOnDestroy(){
    this.subscribtions.forEach(s => s.unsubscribe());
  }

  getSortedRepositories(): Array<RepositoryType>{
    if(!this.repositories)
      return [];
    let bookmarkList = this.repositories.filter(repo => this.bookmarkList.has(repo.full_name));
    let otherList = this.repositories.filter(repo => !this.bookmarkList.has(repo.full_name));
    let sortAlgorithm1 = (arr: Array<RepositoryType>) => {
      return arr.filter(repo => {
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
      })
    };
    return [...sortAlgorithm1(bookmarkList), ...sortAlgorithm1(otherList)];
  }

  repositoryToLoad = '';
  startLoading(repoName: string){
    this.repositoryToLoad = repoName;
  }
  addBookmark(event:MouseEvent, repository :RepositoryType){
    event.preventDefault();
    event.stopPropagation();
    this.store.dispatch(removeBookmark({path: repository.full_name}));
  }
  removeBookmark(event:MouseEvent, repository :RepositoryType){
    event.preventDefault();
    event.stopPropagation();
    this.store.dispatch(addBookmark({path: repository.full_name}));
  }
}
