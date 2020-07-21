import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[editor-host]'
})
export class EditorDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
