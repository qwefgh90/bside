import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RepositoriesComponent } from './repositories.component';
import { WrapperService } from 'src/app/github/wrapper.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatProgressSpinnerModule, MatDividerModule, MatInputModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from 'src/app/testing/activated-route-stub';
import { RouterLinkDirectiveStub } from 'src/app/testing/router-link-directive-stub';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('RepositoriesComponent', () => {
  let component: RepositoriesComponent;
  let fixture: ComponentFixture<RepositoriesComponent>;
  let wrapperSpy;
  let routeStub;
  beforeEach(async(() => {
    wrapperSpy = jasmine.createSpyObj('WrapperService', ['repositories'])
    wrapperSpy.repositories.and.returnValue(Promise.resolve([]));
    routeStub = new ActivatedRouteStub({'userId': 'test'});
    TestBed.configureTestingModule({
      declarations: [RepositoriesComponent, RouterLinkDirectiveStub],
      providers: [{provide: ActivatedRoute, useValue: routeStub},
        { provide: WrapperService, useValue: wrapperSpy }
      ],
      imports: [MatListModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule, MatInputModule,
        FormsModule,
        ReactiveFormsModule, 
        BrowserAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoriesComponent);
    component = fixture.componentInstance;
  });

  it('show a spinner when it is empty', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('mat-spinner').length).toBe(1)
  });

  it('show a list of filtered repositories', fakeAsync(() => {
    wrapperSpy.repositories.and.returnValue(Promise.resolve( [{ name: 'a', updated_at: '2019-05-07T02:22:34Z' }, { name: 'ab', updated_at: '2019-05-07T02:22:34Z' }, { name: 'b', updated_at: '2019-05-07T02:22:34Z' }]));
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    let arr: Array<HTMLAnchorElement> = fixture.debugElement.nativeElement.querySelectorAll('.mat-list-item')
    expect(arr.length).toBe(3);

    component.keyword = "a";
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    arr = fixture.debugElement.nativeElement.querySelectorAll('.mat-list-item')
    expect(arr.length).toBe(2);

    component.keyword = "ab";
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    arr = fixture.debugElement.nativeElement.querySelectorAll('.mat-list-item')
    expect(arr.length).toBe(1);

    component.keyword = "abc";
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();
    arr = fixture.debugElement.nativeElement.querySelectorAll('.mat-list-item')
    expect(arr.length).toBe(0);

  }));


});
