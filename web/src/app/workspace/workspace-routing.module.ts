import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';
import { LoginGuard } from '../oauth/guard/login.guard';
import {MatSidenavModule} from '@angular/material/sidenav';

const routes: Routes = [{path: 'repos/:userId/:repositoryName', component: WorkspaceComponent, canActivate: [LoginGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
