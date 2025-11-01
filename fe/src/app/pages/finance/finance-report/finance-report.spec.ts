import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceReport } from './finance-report';

describe('FinanceReport', () => {
  let component: FinanceReport;
  let fixture: ComponentFixture<FinanceReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
