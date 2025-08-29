import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSpinner } from './page-spinner';

describe('PageSpinner', () => {
  let component: PageSpinner;
  let fixture: ComponentFixture<PageSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
