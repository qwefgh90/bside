import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterContentInit, ViewEncapsulation } from '@angular/core';
import { WrapperService, UserType, RepositoriesType, RepositoryType } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import { OAuthService } from 'src/app/oauth/service/o-auth.service';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { selectQueryParam, State, selectRouteParam, selectCurrentRoute } from 'src/app/app-routing.reducer';
import * as fromRouter from '@ngrx/router-store';
import { projectsRoutes } from '../projects-routing.module'
import { projectsReducerKey, ProjectsState } from '../projects.reducer';
import { addBookmark, removeBookmark } from '../projects.actions';
import { IndexedDbService } from 'src/app/db/indexed-db.service';
import { WorkspacePack } from 'src/app/workspace/workspace/workspace-pack';
import { IndexedDBState } from 'src/app/db/indexed-db.reducer';
@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  host: {'class': 'app-repositories'}
})
export class RepositoriesComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private wrapper: WrapperService, private router: Router, private store: Store<{}>, private indexedDBService: IndexedDbService) { }

  repositories: RepositoriesType;
  initialRepositories: RepositoriesType;
  userId;
  searchInputFormControl = new FormControl();
  subscribtions: Array<Subscription> = []; 
  keyword;
  latestEditTimesAndDirtyCount: Map<number, {date: Date, dirtyCount: number}> = new Map();
  //synced
  user: UserType;
  bookmarkMap = new Map<string, boolean>();
  bookmarkList: Set<string>;
  Updated ="Updated";
  Edited ="Edited";
  selectedOptionForSorting = new FormControl(this.Edited);

  async ngOnInit() {
    let databaseReadySelector = (state: {app: AppState, router: fromRouter.RouterReducerState<any>, indexedDB: IndexedDBState}) => state.indexedDB.ready;
    let userSelector = (state: {app: AppState, router: fromRouter.RouterReducerState<any>, indexedDB: IndexedDBState}) => state.app.user;
    let featureKey = createFeatureSelector(projectsReducerKey)
    let bookmarkListSelector = createSelector(featureKey, databaseReadySelector, (state: ProjectsState, dbready) => ({bookmarkList: state.bookmarkList, dbready}));
    let userIdSelector = selectRouteParam('userId');
    let s4 = this.store.select(databaseReadySelector).subscribe(async (dbready) => {
      if(dbready){
        this.latestEditTimesAndDirtyCount = await this.getLatestEditTimes();
      }
    });
    let user$ = this.store.select(createSelector(databaseReadySelector, userSelector, userIdSelector, selectCurrentRoute, (dbready, user, userId, route: {children,data,firstChild,fragment,outlet,params,queryParams,routeConfig: {path, pathMatch, redirectTo},url: []}) => ({dbready, user, userId, route})));
    let s0 = user$.subscribe(({dbready, user, userId, route}) => {
      if (projectsRoutes.find(r => r.path == route.routeConfig.path) 
            && user && dbready) {
        this.user = user;
        if (userId) {
          this.userId = userId;
          this.wrapper.repositories(this.userId).then((result) => {
            this.initialRepositories = result;
            this.repositories = this.getSortedRepositories();
          }, () => {
            console.error("Repositories can't be loaded.")
          });
        } else
          this.router.navigate(["repos", this.user.login]);
      }
    });

    let s1 = this.store.select(bookmarkListSelector).subscribe(({bookmarkList, dbready}) => {
      if(dbready){
        this.bookmarkList = new Set(bookmarkList);
        this.repositories = this.getSortedRepositories();
      }
    });
    
    let s2 = combineLatest(this.selectedOptionForSorting.valueChanges, this.store.select(databaseReadySelector))
      .subscribe(([v, dbready]) => {
        if(dbready)
          this.repositories = this.getSortedRepositories();
    });
    let s3 = combineLatest(this.searchInputFormControl.valueChanges, this.store.select(databaseReadySelector))
      .subscribe(([v, dbready]) => {
        if (dbready) {
          this.keyword = v;
          this.repositories = this.getSortedRepositories();
        }
      });
    // let s3 = this.searchInputFormControl.valueChanges.subscribe(v => {
    //   this.keyword = v;
    // })
    this.subscribtions.push(s0, s1, s2, s3, s4);
  }
  
  async getLatestEditTimes(){
    let arr = await this.indexedDBService.getRepositories();
    arr = arr.filter(pack => pack.date != undefined && pack.dirtyCount > 0);
    let editTimes = new Map<number, {date: Date, dirtyCount: number}>();
    arr.forEach(pack => {
      let {date, dirtyCount} = editTimes.get(pack.repositoryId) ? editTimes.get(pack.repositoryId) : {date: undefined, dirtyCount: undefined};
      if(!date)
        editTimes.set(pack.repositoryId, {date: pack.date, dirtyCount: pack.dirtyCount});
      else if(date < pack.date)
        editTimes.set(pack.repositoryId, {date: pack.date, dirtyCount: pack.dirtyCount});
    });
    return editTimes;
  }

  ngAfterViewInit(){
  }

  ngOnDestroy(){
    this.subscribtions.forEach(s => s.unsubscribe());
  }

  getSortedRepositories(): Array<RepositoryType>{
    if(!this.initialRepositories)
      return undefined;
    let bookmarkList = this.initialRepositories.filter(repo => this.bookmarkList.has(repo.full_name));
    let otherList = this.initialRepositories.filter(repo => !this.bookmarkList.has(repo.full_name));
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
    let sort2 = (arr: Array<RepositoryType>) => {
      let sorted = sortAlgorithm1(arr).sort((a,b) => {
        let {date: atime} = this.latestEditTimesAndDirtyCount.get(a.id) ? this.latestEditTimesAndDirtyCount.get(a.id) : {date: undefined};
        let {date: btime} = this.latestEditTimesAndDirtyCount.get(b.id) ? this.latestEditTimesAndDirtyCount.get(b.id) : {date: undefined};
        if(!atime && !btime){
          return 0;
        }else if(!atime && btime){
          return 1;
        }else if(atime && !btime){
          return -1;
        }else if(atime < btime)
          return 1;
        else if(atime == btime)
          return 0;
        else
          return -1;
      });
      return sorted;
      
    }
    if(this.selectedOptionForSorting.value == this.Updated)
      return [...sortAlgorithm1(bookmarkList), ...sortAlgorithm1(otherList)];
    else
      return [...sort2(bookmarkList), ...sort2(otherList)];
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
