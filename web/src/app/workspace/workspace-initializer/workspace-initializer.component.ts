import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy, Renderer2 } from '@angular/core';
import { WorkspaceHostDirective } from './workspace-host.directive';
import { WorkspaceComponent } from '../workspace/workspace.component';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { selectQueryParam, selectRouteParam } from 'src/app/app-routing.reducer';
import { workspaceDestoryed } from '../workspace.actions';

@Component({
  selector: 'app-workspace-initializer',
  templateUrl: './workspace-initializer.component.html',
  styleUrls: ['./workspace-initializer.component.css']
})
export class WorkspaceInitializerComponent implements OnInit, OnDestroy {
  @ViewChild(WorkspaceHostDirective, {static: true}) host: WorkspaceHostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private renderer2: Renderer2
    , private store: Store<{}>) { }

  ngOnInit() {
    this.ngrx();
  }

  ngOnDestroy() {
  }

  ngrx(){
    let branchNameSelector = selectQueryParam('branch');
    let repositoryNameSelector = selectRouteParam('repositoryName');
    let userIdSelector = selectRouteParam('userId');
    let repositoryInformationSelector = createSelector(branchNameSelector, repositoryNameSelector, userIdSelector, 
      (branchName, repositoryName, userId) => ({branchName, repositoryName, userId}));
    this.store.select(repositoryInformationSelector).subscribe((info) => {
      this.loadComponent(info);
    });
  }

  loadComponent(info: RepositoryInformation) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(WorkspaceComponent);
    const viewContainerRef = this.host.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.renderer2.addClass(componentRef.location.nativeElement, 'grow');
    componentRef.instance.parameter = info;
  }
}

export interface RepositoryInformation{
  branchName: string;
  repositoryName: string;
  userId: string;
}