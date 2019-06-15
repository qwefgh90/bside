import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { GithubTreeComponent } from './tree/github-tree.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { MatSidenavModule, MatIcon, MatIconModule, MatButtonModule, MatDividerModule, MatInputModule, MatSelectModule, MatMenuModule, MatProgressSpinnerModule, MatBadgeModule, MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTreeModule} from '@angular/material/tree';
import { EditorComponent } from './editor/editor.component';
import { ActionComponent } from './action/action/action.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { StageComponent } from './stage/stage.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { UploadComponent } from './upload/upload.component';
import { DiffEditorComponent } from './diff-editor/diff-editor.component';
import { CommitProgressComponent } from './workspace/commit-progress/commit-progress.component';
import { TabComponent } from './workspace/tab/tab.component';
import { MarkdownModule } from 'ngx-markdown';
import { Database, DatabaseToken } from '../db/database'
import { LocalDbService } from '../db/local-db.service'

@NgModule({
  declarations: [GithubTreeComponent, WorkspaceComponent, EditorComponent, ActionComponent, StageComponent, UploadComponent, DiffEditorComponent, CommitProgressComponent, TabComponent],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule, 
    MatSelectModule,
    MatMenuModule,
    TreeModule.forRoot(),
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatTabsModule,
    MarkdownModule.forRoot()
  ],
  providers: [{provide: DatabaseToken, useClass: LocalDbService}]
})
export class WorkspaceModule { }
