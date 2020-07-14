import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TemplateService } from '../service/template.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ForkComponent } from '../fork/fork.component';
import { Router, ActivatedRoute, UrlSerializer, DefaultUrlSerializer } from '@angular/router';
import { LoginGuard } from 'src/app/oauth/guard/login.guard';
import { TypeState } from 'typestate';

enum UIStatus{
  None,
  Loading,
  PartialLoading,
  Completed,
  Error
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {
  UIStatus = UIStatus;
  constructor(private templateService: TemplateService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private guard: LoginGuard) { }

  @Input("singleMode")
  singleMode: boolean = false;

  partialTemplates: Array<any> = [];
  chunkSize = 18;
  page = 0;
  totalCount: number = undefined;

  fsm = new TypeState.FiniteStateMachine<UIStatus>(UIStatus.None);

  ngOnChanges(changes: SimpleChanges){
    if(changes.singleMode.currentValue == true){
      if(changes.singleMode.currentValue){
        this.chunkSize = 1;
      }
    }
  }

  ngOnInit() {
    this.fsm.fromAny(UIStatus).toAny(UIStatus);
    this.page = 0;
    this.route.queryParamMap.subscribe((pMap) => {
      let page: number = pMap.get('page') != undefined ? Number.parseInt(pMap.get('page')) : undefined;
      let view: string = this.route.snapshot.fragment != undefined ? this.route.snapshot.fragment : undefined;
      if(page > 1)
        this.fsm.go(UIStatus.PartialLoading);
      else
        this.fsm.go(UIStatus.Loading);
      this.loadNext(page).then(() => {
        this.fsm.go(UIStatus.Completed);
        setTimeout(() => {
          if(view != undefined){
            document.getElementById(view).scrollIntoView();
          }
        }, 300);
      }, () => {
        this.fsm.go(UIStatus.Error);
        // this.loading = false;
        console.warn(`It failed to load ${page}`);
      });
    });
  }

  getId(id: number){
    return "id" + id;
  }

  openDialog(repo: any): void {
    let page = this.route.snapshot.queryParams['page'];
    let view = this.getId(repo.id);
    let queryParams = {};
    if (page != undefined)
      queryParams['page'] = page;
    let tree = this.router.createUrlTree(this.route.snapshot.url, {queryParams: queryParams, fragment: view});
    if(this.guard.isLogin){
      // let arr = repo.full_name.split('/');
      const dialogRef = this.dialog.open(ForkComponent, {
        width: '350px',
        data: {owner: repo.owner.login, repoName: repo.name, htmlUrl: repo.html_url, cloneRepo: repo}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        let res = result;
        if(res != undefined){
          this.router.navigate([`/repos/${res.repo.full_name}`], {queryParams: {branch: res.pageBranch}}) 
        }
      });
    }
  }

  onScroll($event){
    let e: HTMLDivElement = $event.srcElement
    let boxList = e.querySelectorAll('.box');
    if (boxList.length > 0) {
      let lastElement = boxList.item(boxList.length - 1);
      if (this.isScrolledIntoView(lastElement) && !this.fsm.is(UIStatus.Loading)) {
        this.router.navigate([], {queryParams: {page: this.page+1}});
      }
    }
  }

  onLoadMore(){
    if(!this.fsm.is(UIStatus.Loading)){
      this.router.navigate([], {queryParams: {page: this.page+1}});
    }
  }

  /**
   * It must not be called more than twoice at the time.
   * It gets templates from current page to a page.
   * @param page 
   */
  async loadNext(page: number = undefined): Promise<void>{
    if(page == undefined){
      page = this.page + 1;
    }
    if(this.totalCount == undefined || (this.totalCount > (this.page * this.chunkSize)) ){
      let amountToGet = (page - this.page) < 0 ? 0 : (page - this.page)* this.chunkSize;
      return this.templateService.subTemplates(this.page + 1, amountToGet).then(v => {
        v.items.forEach((obj) => {
          if (obj.description != undefined)
            obj.description = obj.description.replace(/\?/g, '');
        });
        this.partialTemplates = this.partialTemplates.concat(v.items);
        this.totalCount = v.total_count;
        this.page = page;
      });
    }else{
      return new Promise((res,rej) => {
        rej("It is not proper condition to load more.")
      })
    }
  }


  getPreview(id: string, url: string){
    return `${environment.apiServer}/preview?id=${id}&url=${url}`;
  }

  getFullUrl(url: string){
    if(!url.startsWith("http://") && !url.startsWith("https://")){
      return "http://" + url;
    }else 
      return url;
  }

  isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
  }
}
