import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortIcon } from './sort-icon';

describe('SortIcon', () => {
  let component: SortIcon;
  let fixture: ComponentFixture<SortIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
