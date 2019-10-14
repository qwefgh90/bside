import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ParamMap, Params, convertToParamMap, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { TemplateService } from '../service/template.service';
import { LoginGuard } from 'src/app/oauth/guard/login.guard';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let routerSpy;
  let routeStub;
  let matDialogSpy;

  beforeEach(async(() => {
    
    routeStub = new ActivatedRouteStub({});
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
    let templateServiceSpy = jasmine.createSpyObj('TemplateService', ['templates']);
    let loginGuardSpy = jasmine.createSpyObj('LoginGuard', ['checkLogin']);

    TestBed.configureTestingModule({
      declarations: [ ListComponent ],
      providers: [{provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: routeStub},
        {provide: MatDialog, useValue: matDialogSpy},
        {provide: TemplateService, useValue: templateServiceSpy},
        {provide: LoginGuard, useValue: loginGuardSpy}],
      imports: [
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        HttpClientTestingModule,
        MatIconModule, 
        MatDialogModule,
        MatFormFieldModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();
  private qsubject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();
  /** The mock paramMap observable */
  readonly queryParamMap = this.qsubject.asObservable();

  snapshot = new ActivatedRouteSnapshotStub();

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
    this.snapshot.paramMap = convertToParamMap(params);
    this.snapshot.params = params;
  };
  /** Set the paramMap observables's next value */
  setQueryParamMap(params?: Params) {
    this.qsubject.next(convertToParamMap(params));
    this.snapshot.queryParamMap = convertToParamMap(params);
    this.snapshot.queryParams = params;
  };
}
class ActivatedRouteSnapshotStub{
    constructor(){
        this.paramMap = convertToParamMap({});
        this.queryParamMap = convertToParamMap({});
    }
    params: Params;
    queryParams: Params;
    paramMap: ParamMap;
    queryParamMap: ParamMap;
}
