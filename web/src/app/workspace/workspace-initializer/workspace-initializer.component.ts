import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy, Renderer2 } from '@angular/core';
import { WorkspaceHostDirective } from './workspace-host.directive';
import { WorkspaceComponent } from '../workspace/workspace.component';

@Component({
  selector: 'app-workspace-initializer',
  templateUrl: './workspace-initializer.component.html',
  styleUrls: ['./workspace-initializer.component.css']
})
export class WorkspaceInitializerComponent implements OnInit, OnDestroy {
  @ViewChild(WorkspaceHostDirective, {static: true}) host: WorkspaceHostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private renderer2: Renderer2) { }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(WorkspaceComponent);

    const viewContainerRef = this.host.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    
    this.renderer2.addClass(componentRef.location.nativeElement, 'grow');
  }
}