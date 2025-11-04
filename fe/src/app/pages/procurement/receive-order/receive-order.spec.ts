import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveOrder } from './receive-order';

describe('ReceiveOrder', () => {
  let component: ReceiveOrder;
  let fixture: ComponentFixture<ReceiveOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiveOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
