import { ActivationEnd, ActivatedRouteSnapshot } from "@angular/router";
let snapshotWhenGoingToWorkspace: ActivatedRouteSnapshot = {routeConfig: {component: 'not undefined', path: ":userId/:repositoryName"}} as unknown as ActivatedRouteSnapshot;
export let activationEndEventWhenGoingToWorkspace: ActivationEnd = new ActivationEnd(snapshotWhenGoingToWorkspace);

let snapshotWhenBeingOutOfWorkspace: ActivatedRouteSnapshot = {routeConfig: {component: 'not undefined', path: ""}} as unknown as ActivatedRouteSnapshot;
export let activationEndEventWhenBeingOutOfWorkspace: ActivationEnd = new ActivationEnd(snapshotWhenBeingOutOfWorkspace);

