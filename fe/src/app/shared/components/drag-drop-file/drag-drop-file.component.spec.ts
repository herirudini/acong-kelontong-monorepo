import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { DragDropFileComponent } from './drag-drop-file.component';
import { Injector } from '@angular/core';
import { TranslateService, TranslateModule, TranslateStore } from '@ngx-translate/core';

describe('DragDropFileComponent', () => {
  let component: DragDropFileComponent;
  let fixture: ComponentFixture<DragDropFileComponent>;
  let translateService: TranslateService;
  let injector: Injector;

  const TRANSLATION_EN = require('src/app/modules/i18n/vocabs/en.ts');

  beforeEach( async () => {
    await TestBed.configureTestingModule({
      declarations: [DragDropFileComponent],
      imports: [TranslateModule.forChild()],
      providers: [
        TranslateStore
      ],
    }).compileComponents();
    injector = getTestBed();
  });

  beforeEach(()=>{
    fixture = TestBed.createComponent(DragDropFileComponent);
    translateService = injector.get(TranslateService);
    component = fixture.componentInstance;
    spyOn(translateService, 'getBrowserLang').and.returnValue('en');
    translateService.setTranslation('en', TRANSLATION_EN);
    translateService.use('en');
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
