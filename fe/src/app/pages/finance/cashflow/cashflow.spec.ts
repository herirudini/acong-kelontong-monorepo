import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cashflow } from './cashflow';

describe('Cashflow', () => {
  let component: Cashflow;
  let fixture: ComponentFixture<Cashflow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cashflow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cashflow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
