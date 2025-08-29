import { TestBed } from '@angular/core/testing';

import { PageGuardService } from './page-guard-service';

describe('PageGuardService', () => {
  let service: PageGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
