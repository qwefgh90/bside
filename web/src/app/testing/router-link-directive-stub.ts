import { Directive, Input, HostListener } from '@angular/core';

@Directive({
    selector: '[routerLink]'
})
export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    @HostListener('click')
    onClick() {
        this.navigatedTo = this.linkParams;
    }
}