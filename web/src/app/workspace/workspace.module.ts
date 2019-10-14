import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { GithubTreeComponent } from './tree/github-tree.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
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
