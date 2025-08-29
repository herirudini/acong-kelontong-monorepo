import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardV1 } from './dashboard-v1';

describe('DashboardV1', () => {
  let component: DashboardV1;
  let fixture: ComponentFixture<DashboardV1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardV1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardV1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
