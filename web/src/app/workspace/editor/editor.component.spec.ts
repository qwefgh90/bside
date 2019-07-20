import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import { MatSidenavModule, MatProgressSpinnerModule } from '@angular/material';
import { DiffEditorComponent } from '../diff-editor/diff-editor.component';
import { MarkdownModule } from 'ngx-markdown';
import { DeviceDetectorModule } from 'ngx-device-detector';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorComponent, DiffEditorComponent ],
      imports: [MatSidenavModule,
        MatProgressSpinnerModule,
      MarkdownModule.forRoot(),
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
