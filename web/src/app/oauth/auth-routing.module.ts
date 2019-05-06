import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RedirectComponent } from './redirect/redirect.component';

const routes: Routes = [{
  path: 'login',
  component: LoginComponent
},
{
  path: 'redirect',
  component: RedirectComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
