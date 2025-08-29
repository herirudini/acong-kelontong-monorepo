import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardV3 } from './dashboard-v3';

describe('DashboardV3', () => {
  let component: DashboardV3;
  let fixture: ComponentFixture<DashboardV3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardV3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardV3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
