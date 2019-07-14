import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesRoutingModule } from './templates-routing.module';
import { ListComponent } from './list/list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    FlexLayoutModule,
    MatButtonModule
  ]
})
export class TemplatesModule { }
