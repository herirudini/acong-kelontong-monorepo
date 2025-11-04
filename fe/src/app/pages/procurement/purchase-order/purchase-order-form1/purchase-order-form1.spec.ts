import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderForm1 } from './purchase-order-form1';

describe('PurchaseOrderForm1', () => {
  let component: PurchaseOrderForm1;
  let fixture: ComponentFixture<PurchaseOrderForm1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderForm1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderForm1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
