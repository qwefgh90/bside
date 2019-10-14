import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TabComponent } from './tab.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule, MatTab } from '@angular/material/tabs';
import { WorkspaceService } from '../workspace.service';
import { GithubTreeNode } from '../tree/github-tree-node';
import { tree } from 'src/app/testing/mock-data';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorkspacePack } from '../workspace/workspace-pack';

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;
  let workspaceService: WorkspaceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabComponent ],
      imports: [MatTabsModule, MatIconModule, BrowserAnimationsModule],
      providers: [WorkspaceService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    workspaceService = TestBed.get(WorkspaceService);
    fixture.detectChanges();
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
    let fileName1 = 'test.txt';
    component.addTab(fileName1);
    let fileName2 = 'test2.txt';
    component.addTab(fileName2);
    let fileName3 = 'test3.txt';
    component.addTab(fileName3);
    fixture.detectChanges();
    tick(3000);
    
    component.load(WorkspacePack.of(0,'','','','',[],[],['load1.txt', 'load2.txt'], 'load2.txt'));
    fixture.detectChanges();
    tick(3000);

    let cinfo1: MatTab = tabSelectedSpy.calls.all()[0].args[0];
    let cinfo2: MatTab = tabSelectedSpy.calls.all()[1].args[0];

    expect(cinfo1.textLabel).toBe(fileName1);
    expect(cinfo2.textLabel).toBe('load2.txt');
  }));

  it('SelectNode() from service', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let existsSpy = spyOn(component, 'exists');
    let addTabSpy = spyOn(component, 'addTab');
    let changeTabSpy = spyOn(component, 'changeTab');

    workspaceService.selectNode(undefined, 'test.txt');
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

    workspaceService.removeNode(undefined, 'test.txt');
    fixture.detectChanges();
    tick(3000);

    expect(removeTabSpy.calls.count()).toBe(1);
  }));
  
  it('MoveNodeInTree() from service', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    tick(3000);

    let fileName = 'oldname.txt';
    let newNode = Object.assign({}, tree.tree[0]);
    newNode.path = 'newname.txt';
    component.addTab(fileName);

    workspaceService.moveNodeInTree(undefined, fileName, GithubTreeNode.githubTreeNodeFactory.of(newNode));
    fixture.detectChanges();
    tick(3000);

    expect(component.tabs.length).toBe(1);
    expect(component._tabs[0]).toBe(newNode.path);
  }));
  
});
