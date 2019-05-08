import { Component, OnInit } from '@angular/core';
import { WrapperService } from 'src/app/github/wrapper.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {

  constructor(private wrapper: WrapperService, private route: ActivatedRoute) { }

  repositories: Array<any> = [];
  userId;
  repositoryId;

  ngOnInit() {
    this.route.paramMap.subscribe((p) => {
      if(p.has('userId')){
        this.userId = p.get('userId');
        this.wrapper.repositories(this.userId).then((result) => {
          this.repositories = result.data;
        }, () =>{
          console.error("Repositories can't be loaded.")
        });
      }
    })
  }
}
