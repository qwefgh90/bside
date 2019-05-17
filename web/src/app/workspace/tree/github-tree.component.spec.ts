import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GithubTreeComponent } from './github-tree.component';
import {  MatIconModule, MatButtonModule, MatDividerModule, MatSelectModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { TreeModule } from 'angular-tree-component';
import { tree, repositoryDetails } from 'src/app/testing/mock-data';
import { SimpleChange } from '@angular/core';
describe('TreeComponent', () => {
  let component: GithubTreeComponent;
  let fixture: ComponentFixture<GithubTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GithubTreeComponent ],
      imports: [
        TreeModule.forRoot(),
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatDividerModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('repository', () => {
    component.repository = repositoryDetails;
    fixture.detectChanges();
    let name = fixture.nativeElement.querySelector('.repository-title > div > h3').textContent;
    expect(repositoryDetails.name).toBe(name);
  });

  it('render tree', () => {
    component.repository = repositoryDetails;
    component.tree = tree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})

    fixture.detectChanges();
    const levelOneNodes = tree.tree.filter(e => {
      return !e.path.includes("/");
    });
  // heroDe.triggerEventHandler('click', null);
    let treeNodes = fixture.nativeElement.querySelectorAll('tree-node');
    expect(treeNodes.length).toBe(levelOneNodes.length);
  });

  it('click one node', () => {
    component.repository = repositoryDetails;
    component.tree = tree;
    component.ngOnChanges({"tree": new SimpleChange(undefined, tree, false)})
    fixture.detectChanges();
    
    let treeNodes: NodeList = fixture.nativeElement.querySelectorAll('.node-title');
    let e1: HTMLDivElement = (treeNodes[0] as HTMLDivElement);
    e1.click();    
    fixture.detectChanges();

    expect(component.selectedNode.data.name).toBe(tree.tree[0].path);
  });
});
