import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimeAgoPipe} from 'time-ago-pipe';
import { ProjectsRoutingModule } from './projects-routing.module';
import { RepositoriesComponent } from './repositories/repositories.component';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserBoardComponent } from './user-board/user-board.component';
import { HistoryComponent } from './history/history.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { StoreModule } from '@ngrx/store';
import { projectsReducerKey, projectsReducer } from './projects.reducer';
import { MatSelectModule } from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
@NgModule({
  declarations: [RepositoriesComponent, UserBoardComponent, HistoryComponent, UserProfileComponent, TimeAgoPipe],
  imports: [
    StoreModule.forFeature(projectsReducerKey, projectsReducer),
    CommonModule,
    ProjectsRoutingModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSelectModule,
    MatBadgeModule
  ]
})
export class ProjectsModule { }
