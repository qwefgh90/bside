import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { RepositoriesComponent } from './repositories/repositories.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatProgressSpinnerModule, MatDividerModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  declarations: [RepositoriesComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class ProjectsModule { }
