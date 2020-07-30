import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DiffEditorComponent } from '../diff-editor/diff-editor.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { MarkdownEditorComponent } from '../markdown-editor/markdown-editor.component';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditorComponent, DiffEditorComponent, MarkdownEditorComponent],
      imports: [MatSidenavModule,
        MatProgressSpinnerModule,
        DeviceDetectorModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
