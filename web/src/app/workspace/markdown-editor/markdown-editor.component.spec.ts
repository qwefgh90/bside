import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MarkdownEditorComponent } from './markdown-editor.component';
import { WorkspacePack } from '../workspace/workspace-pack';
import { mockWorkspacePack } from 'src/app/testing/mock-data';
import { Store } from '@ngrx/store';

describe('MarkdownEditorComponent', () => {
  let component: MarkdownEditorComponent;
  let fixture: ComponentFixture<MarkdownEditorComponent>;

  beforeEach(async(() => {
    let storeSpy = jasmine.createSpyObj("Store", ["dispatch"]);
    TestBed.configureTestingModule({
      declarations: [ MarkdownEditorComponent ],
      imports: [],
      providers: [{provide: Store, useValue: storeSpy}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('select()', () => {
    expect(component.current.path).toBeUndefined();
    expect(component.current.content).toBeUndefined();
    let fName = 'hello.txt';
    expect(component.select(fName)).toBeFalsy();
    let content = 'content';
    component.setContent(fName, content);
    expect(component.select(fName)).toBeTruthy();
    expect(component.current.path).toBe(fName);
    expect(component.current.content).toBe(content);
  })

  it('setContent()', () => {
    let fName = 'hello.txt';
    let content = 'content';
    let content2 = 'content2';
    component.setContent(fName, content);
    expect(component.getContent(fName)).toBe(content);
    component.setContent(fName, content2);
    expect(component.getContent(fName)).toBe(content2);
  })


  it('exist()', () => {
    let fName = 'hello.txt';
    let content = 'content';
    component.setContent(fName, content);
    expect(component.exist(fName)).toBeTruthy();
  })

  it('getContent()', () => {
    expect(component.getContent('fakePath')).toBeUndefined()
  })

  it('removeContent()', () => {
    let fName = 'hello.txt';
    let content = 'content';
    component.setContent(fName, content);
    expect(component.getContent(fName)).toBe(content);
    component.removeContent(fName);
    expect(component.getContent(fName)).toBeUndefined();
  })

  // it('md()', fakeAsync(() => {
  //   tick(10000);
  //   let fName = 'hello.txt';
  //   let content = 'content';
  //   component.setContent(fName, content);
  //   component.md();
  //   tick(10000);
  //   expect(component.isMdOn).toBeTruthy();
  // }))

  it('readonly', () => {
    expect(component.readonly).toBeFalsy();
    component.readonly = true;
    expect(component.readonly).toBeTruthy();
  })

  it('load', () => {
    let setContentSpy = spyOn(component, 'setContent');
    component.load(mockWorkspacePack);
    expect(setContentSpy.calls.count()).toBe(1);
  })

});
