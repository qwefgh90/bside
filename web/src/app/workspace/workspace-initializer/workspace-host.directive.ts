import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[workspace-host]'
})
export class WorkspaceHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
