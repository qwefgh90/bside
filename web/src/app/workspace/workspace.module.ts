import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { GithubTreeComponent } from './tree/github-tree.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { MatSidenavModule, MatIcon, MatIconModule, MatButtonModule, MatDividerModule, MatInputModule, MatSelectModule, MatMenuModule, MatProgressSpinnerModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTreeModule} from '@angular/material/tree';
import { EditorComponent } from './editor/editor.component';
import { NgxMdModule } from 'ngx-md';
import { ActionComponent } from './action/action/action.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { StageComponent } from './stage/stage.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [GithubTreeComponent, WorkspaceComponent, EditorComponent, ActionComponent, StageComponent],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    NgxMdModule.forRoot(),
    MatExpansionModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule, 
    MatSelectModule,
    MatMenuModule,
    TreeModule.forRoot(),
    MatProgressSpinnerModule,
    MatButtonToggleModule
  ]
})
export class WorkspaceModule { }
