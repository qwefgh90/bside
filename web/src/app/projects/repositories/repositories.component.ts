import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { OAuthService } from 'src/app/oauth/service/o-auth.service';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private wrapper: WrapperService, private route: ActivatedRoute, private router: Router) { }

  repositories: Array<any>;
  userId;
  searchInputFormControl = new FormControl();
  subscribtions: Array<Subscription> = []; 
  keyword;

  ngOnInit() {
    let s = this.route.paramMap.subscribe((p) => {
      if(p.has('userId')){
        this.userId = p.get('userId');
        this.wrapper.repositories(this.userId).then((result) => {
          this.repositories = result;
        }, () =>{
          console.error("Repositories can't be loaded.")
        });
      }else{
        this.wrapper.user().then(user => {
          // this.userId = user.login;
          this.router.navigate(["repos",user.login]);
        });
      }
    });
    this.searchInputFormControl.valueChanges.subscribe(v => {
      this.keyword = v;
    })
    this.subscribtions.push(s);
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
