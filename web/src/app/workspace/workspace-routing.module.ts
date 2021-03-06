import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';
import { LoginGuard } from '../oauth/guard/login.guard';
import {MatSidenavModule} from '@angular/material/sidenav';
import { WorkspaceInitializerComponent } from './workspace-initializer/workspace-initializer.component';

const routes: Routes = [{path: ':userId/:repositoryName', component: WorkspaceInitializerComponent, canActivate: [LoginGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }
