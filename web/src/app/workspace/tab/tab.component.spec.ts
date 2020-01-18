import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TabComponent } from './tab.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule, MatTab } from '@angular/material/tabs';
import { GithubTreeNode } from '../tree/github-tree-node';
import { tree } from 'src/app/testing/mock-data';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorkspacePack } from '../workspace/workspace-pack';
import { SelectAction } from '../core/action/user/select-action';
import { FileRenameAction } from '../core/action/user/file-rename-action';
import { RemoveNodeAction } from '../core/action/user/remove-node-action';
import { UserActionDispatcher } from '../core/action/user/user-action-dispatcher';
import { MicroActionComponentMap, SupportedComponents } from '../core/action/micro/micro-action-component-map';

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;
  let dispatcher: UserActionDispatcher;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabComponent ],
      imports: [MatTabsModule, MatIconModule, BrowserAnimationsModule],
      providers: [{provide: UserActionDispatcher, useValue: new UserActionDispatcher()}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dispatcher = TestBed.get(UserActionDispatcher);
    MicroActionComponentMap.getSubjectByComponent(SupportedComponents.WorkspaceComponent).subscribe(m => m.succeed(()=>{}));
    MicroActionComponentMap.getSubjectByComponent(SupportedComponents.EditorComponent).subscribe(m => m.succeed(()=>{}));
    MicroActionComponentMap.getSubjectByComponent(SupportedComponents.GithubTreeComponent).subscribe(m => m.succeed(()=>{}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addTab()', () => {
    let fileName = 'test.txt';
    component.addTab(fileName);
    expect(component.tabs.length).toBe(1);
    expect(component.tabs[0]).toBe(fileName);
  });

  it('removeTab()', () => {
    let fileName = 'test.txt';
    component.addTab(fileName);
    component.removeTab(fileName);
    expect(component.tabs.length).toBe(0);
  });
  
  it('exists()', () => {
    let fileName = 'test.txt';
    component.addTab(fileName);
    expect(component.exists(fileName)).toBeTruthy();
  });
  
  it('changeTab()', fakeAsync(() => {
    let tabSelectedSpy = spyOn(component, 'tabSelected');
    let fileName1 = 'test.txt';
    component.addTab(fileName1);
    let fileName2 = 'test2.txt';
    component.addTab(fileName2);
    let fileName3 = 'test3.txt';
    component.addTab(fileName3);
    fixture.detectChanges();
    tick(3000);
    
    component.changeTab(fileName3);

    fixture.detectChanges();
    tick(3000);

    expect(tabSelectedSpy.calls.count()).toBe(2);
  }));

  it('load()', fakeAsync(() => {
    let tabSelectedSpy = spyOn(component, 'tabSelected');
    fixture.detectChanges();
    tick(3000);
    
    component.load(WorkspacePack.of(0,'','','','',[],[],['load1.txt', 'load2.txt'], 'load2.txt', false));
    fixture.detectChanges();
    tick(3000);

    let cinfo1: MatTab = tabSelectedSpy.calls.all()[0].args[0];
    expect(cinfo1.textLabel).toBe('load1.txt');
  }));

  it('SelectNode() from service', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let existsSpy = spyOn(component, 'exists');
    let addTabSpy = spyOn(component, 'addTab');
    let changeTabSpy = spyOn(component, 'changeTab');

    new SelectAction('test.txt', this, new UserActionDispatcher()).start();
    fixture.detectChanges();
    tick(3000);

    expect(existsSpy.calls.count()).toBe(1);
    expect(addTabSpy.calls.count()).toBe(1);
    expect(changeTabSpy.calls.count()).toBe(1);
  }));
  
  it('RemoveNode() from service', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let fileName = 'test.txt';
    component.addTab(fileName);
    let removeTabSpy = spyOn(component, 'removeTab');

    new RemoveNodeAction( 'test.txt', undefined, new UserActionDispatcher()).start();

    fixture.detectChanges();
    tick(3000);

    expect(removeTabSpy.calls.count()).toBe(1);
  }));
  
  it('FileRenameAction()', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let fileName = 'oldname.txt';
    let newNode = Object.assign({}, tree.tree[0]);
    newNode.path = 'newname.txt';
    component.addTab(fileName);
    fixture.detectChanges();
    tick(10000);

    new FileRenameAction(fileName, fileName, newNode.path, GithubTreeNode.getNameFromPath(newNode.path), undefined, dispatcher).start();
    fixture.detectChanges();
    tick(3000);

    expect(component.tabs.length).toBe(1);
    expect(component._tabs[0]).toBe(newNode.path);
  }));
  
});
