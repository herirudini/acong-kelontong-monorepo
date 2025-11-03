import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderItemForm } from './purchase-order-item-form';

describe('PurchaseOrderItemForm', () => {
  let component: PurchaseOrderItemForm;
  let fixture: ComponentFixture<PurchaseOrderItemForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderItemForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderItemForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
