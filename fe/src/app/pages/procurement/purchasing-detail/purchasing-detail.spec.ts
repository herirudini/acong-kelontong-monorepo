import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingDetail } from './purchasing-detail';

describe('PurchasingDetail', () => {
  let component: PurchasingDetail;
  let fixture: ComponentFixture<PurchasingDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasingDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasingDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
