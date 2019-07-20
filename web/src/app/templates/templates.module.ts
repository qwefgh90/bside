import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesRoutingModule } from './templates-routing.module';
import { ListComponent } from './list/list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatProgressSpinnerModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatInputModule } from '@angular/material';
import { MatCardModule} from '@angular/material/card';
import { ForkComponent } from './fork/fork.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressButtonsModule } from 'mat-progress-buttons';

@NgModule({
  declarations: [ListComponent, ForkComponent],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatProgressButtonsModule,
    MatSelectModule
  ],
  entryComponents: [
    ForkComponent
  ]
})
export class TemplatesModule { }
