import { TestBed } from '@angular/core/testing';

import { PageSpinnerService } from './page-spinner-service';

describe('PageSpinnerService', () => {
  let service: PageSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
