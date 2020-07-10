import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RepositoriesComponent } from './repositories/repositories.component';
import { LoginGuard } from '../oauth/guard/login.guard';
import { UserBoardComponent } from './user-board/user-board.component';

export const projectsRoutes: Routes = [{path: 'repos/:userId', component: UserBoardComponent, canActivate: [LoginGuard]},
  {path: 'repos', component: UserBoardComponent, canActivate: [LoginGuard]}];

@NgModule({
  imports: [RouterModule.forChild(projectsRoutes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
