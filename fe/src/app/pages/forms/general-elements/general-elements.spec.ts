import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralElements } from './general-elements';

describe('GeneralElements', () => {
  let component: GeneralElements;
  let fixture: ComponentFixture<GeneralElements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralElements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralElements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
