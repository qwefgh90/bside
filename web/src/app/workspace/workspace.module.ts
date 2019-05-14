import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { TreeComponent } from './tree/tree.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { MatSidenavModule, MatIcon, MatIconModule, MatButtonModule, MatDividerModule, MatInputModule, MatSelectModule, MatMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTreeModule} from '@angular/material/tree';
import { EditorComponent } from './editor/editor.component';
import { NgxMdModule } from 'ngx-md';
import { ActionComponent } from './action/action/action.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  declarations: [TreeComponent, WorkspaceComponent, EditorComponent, ActionComponent],
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
    TreeModule.forRoot()
  ]
})
export class WorkspaceModule { }
