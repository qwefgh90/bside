import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, OnDestroy, AfterContentInit {

  constructor(private wrapper: WrapperService, private route: ActivatedRoute) { }

  userId;
  repositoryName;
  repositoryDetails;
  subscribe: Subscription;
  
  @ViewChild("leftDrawer") leftPane: MatDrawer;
  @ViewChild("rightDrawer") rightPane: MatDrawer;
  
  ngOnInit() {
    this.subscribe = this.route.paramMap.subscribe((p) => {
      if(p.has('userId') && p.has('repositoryName')){
        this.userId = p.get('userId');
        this.repositoryName = p.get('repositoryName');
        this.wrapper.repository(this.userId, this.repositoryName).then((result) => {
          this.repositoryDetails = result;
        }, () =>{
          console.error("Repository can't be loaded.")
        });
      }
    })
  }

  ngAfterContentInit(){
    this.toggle();
  }

  ngOnDestroy(){
    this.subscribe.unsubscribe();
  }

  toggle(){
    this.leftPane.toggle();
    this.rightPane.toggle();
  }

}
