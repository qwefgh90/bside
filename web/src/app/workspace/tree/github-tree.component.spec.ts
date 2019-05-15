import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubTreeComponent } from './github-tree.component';
import {  MatIconModule, MatButtonModule, MatDividerModule, MatSelectModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { TreeModule } from 'angular-tree-component';
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
});
