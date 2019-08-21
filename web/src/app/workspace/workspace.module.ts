import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { GithubTreeComponent } from './tree/github-tree.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { MatSidenavModule, MatIconModule, MatButtonModule, MatDividerModule, MatInputModule, MatSelectModule, MatMenuModule, MatProgressSpinnerModule, MatBadgeModule, MatTabsModule, MatDialogModule, MatTableModule } from '@angular/material';
import { MatTreeModule} from '@angular/material/tree';
import { EditorComponent } from './editor/editor.component';
import { ActionComponent } from './action/action.component';
import { MatExpansionModule} from '@angular/material/expansion';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { StageComponent } from './stage/stage.component';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { UploadComponent } from './upload/upload.component';
import { DiffEditorComponent } from './diff-editor/diff-editor.component';
import { CommitProgressComponent } from './workspace/commit-progress/commit-progress.component';
import { TabComponent } from './tab/tab.component';
import { MarkdownModule } from 'ngx-markdown';
import { DatabaseToken } from '../db/database'
import { LocalDbService } from '../db/local-db.service'
import { DeviceDetectorModule } from 'ngx-device-detector';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { InfoComponent } from './info/info.component';
import { BuildHistoryComponent } from './build-history/build-history.component';

@NgModule({
  declarations: [GithubTreeComponent, WorkspaceComponent, EditorComponent, ActionComponent, StageComponent, UploadComponent, DiffEditorComponent, CommitProgressComponent, TabComponent, MarkdownEditorComponent, InfoComponent, BuildHistoryComponent],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    MatSidenavModule,
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
    MarkdownModule.forRoot(),    
    DeviceDetectorModule.forRoot(),
    FlexLayoutModule,
    MatDialogModule,
    MatTableModule
  ],
  providers: [{provide: DatabaseToken, useClass: LocalDbService}],
  entryComponents: [
    InfoComponent,
    BuildHistoryComponent
  ]
})
export class WorkspaceModule { }
