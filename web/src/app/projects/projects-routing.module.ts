import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RepositoriesComponent } from './repositories/repositories.component';
import { LoginGuard } from '../oauth/guard/login.guard';

const routes: Routes = [{path: 'repos/:userId', component: RepositoriesComponent, canActivate: [LoginGuard]},
  {path: 'repos', component: RepositoriesComponent, canActivate: [LoginGuard]}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
