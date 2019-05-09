import { Component, OnInit, OnDestroy } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit, OnDestroy {

  constructor(private wrapper: WrapperService, private route: ActivatedRoute) { }

  private repositories: Array<any>;
  userId;
  searchInputFormControl = new FormControl();
  subscribe: Array<Subscription> = []; 
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
      }
    });
    this.searchInputFormControl.valueChanges.subscribe(v => {
      this.keyword = v;
    })
    this.subscribe.push(s);

  }

  ngOnDestroy(){
    this.subscribe.forEach(s => s.unsubscribe());
  }

  getRepositories(){
    return this.repositories.filter(repo => {
      if(this.keyword == undefined)
        return true;
      if(this.keyword != undefined && (repo.name as string).startsWith(this.keyword)){
        return true;
      }
      return false;
    })
  }
}
