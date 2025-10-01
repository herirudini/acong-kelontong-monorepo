import { FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import { ElementRef, Renderer2 } from '@angular/core';
import { FormValidation } from './form-validation';

describe('FormValidation', () => {
  let formGroupDirective: FormGroupDirective;
  let elementRef: ElementRef<HTMLFormElement>;
  let renderer: Renderer2;

  beforeEach(() => {
    // Create a form with one control
    const form = new FormGroup({
      first_name: new FormControl('')
    });

    // Mock FormGroupDirective
    formGroupDirective = {
      form,
      // not using submit here, just mocking structure
    } as unknown as FormGroupDirective;

    // Mock ElementRef with a fake form element
    const formEl = document.createElement('form');
    const inputEl = document.createElement('input');
    inputEl.setAttribute('formControlName', 'first_name');
    formEl.appendChild(inputEl);

    elementRef = new ElementRef(formEl);

    // Mock Renderer2 (only methods we need)
    renderer = {
      addClass: jasmine.createSpy('addClass'),
      removeClass: jasmine.createSpy('removeClass')
    } as unknown as Renderer2;
  });

  it('should create an instance', () => {
    const directive = new FormValidation(formGroupDirective, elementRef, renderer);
    expect(directive).toBeTruthy();
  });

  it('should add is-invalid when control is invalid and touched', () => {
    const directive = new FormValidation(formGroupDirective, elementRef, renderer);
    directive.ngOnInit();

    const control = formGroupDirective.form.get('first_name');
    control?.markAsTouched();
    control?.setErrors({ required: true });

    // force update
    control?.updateValueAndValidity();

    expect(renderer.addClass).toHaveBeenCalledWith(
      jasmine.anything(),
      'is-invalid'
    );
  });

  it('should add is-valid when control is valid and touched', () => {
    const directive = new FormValidation(formGroupDirective, elementRef, renderer);
    directive.ngOnInit();

    const control = formGroupDirective.form.get('first_name');
    control?.setValue('John');
    control?.markAsTouched();

    expect(renderer.addClass).toHaveBeenCalledWith(
      jasmine.anything(),
      'is-valid'
    );
  });
});
