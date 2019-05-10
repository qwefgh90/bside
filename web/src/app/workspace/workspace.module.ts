import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { TreeComponent } from './tree/tree.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { MatSidenavModule, MatIcon, MatIconModule, MatButtonModule, MatDividerModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTreeModule} from '@angular/material/tree';
import { EditorComponent } from './editor/editor.component';
@NgModule({
  declarations: [TreeComponent, WorkspaceComponent, EditorComponent],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ]
})
export class WorkspaceModule { }
