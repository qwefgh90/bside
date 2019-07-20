import { TestBed } from '@angular/core/testing';

import { TemplateService } from './template.service';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
    ], imports: [HttpClientTestingModule]}));

  it('should be created', () => {
    const service: TemplateService = TestBed.get(TemplateService);
    expect(service).toBeTruthy();
  });
});
