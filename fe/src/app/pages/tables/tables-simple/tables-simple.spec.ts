import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesSimple } from './tables-simple';

describe('TablesSimple', () => {
  let component: TablesSimple;
  let fixture: ComponentFixture<TablesSimple>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesSimple]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablesSimple);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
