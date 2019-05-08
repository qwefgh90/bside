import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { RepositoriesComponent } from './repositories/repositories.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatProgressSpinnerModule, MatDividerModule } from '@angular/material';
@NgModule({
  declarations: [RepositoriesComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ]
})
export class ProjectsModule { }
