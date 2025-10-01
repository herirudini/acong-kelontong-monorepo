import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgControl } from '@angular/forms';

@Directive({
  selector: '[appInputValidation]'
})
export class InputValidation implements OnInit {
  private control: AbstractControl | null = null;
  private inputElement: HTMLElement | null = null;

  constructor(
    private host: ElementRef,          // the element where directive is placed
    private renderer: Renderer2,
    private formGroupDir: FormGroupDirective
  ) {}

  ngOnInit(): void {
    // find the first input/select/textarea inside host element
    this.inputElement = this.host.nativeElement.querySelector(
      'input[formControlName], select[formControlName], textarea[formControlName]'
    );

    if (!this.inputElement) {
      console.warn('appInputValidation: No input/select/textarea with formControlName found inside', this.host.nativeElement);
      return;
    }

    // grab its NgControl from the formGroup
    const controlName = this.inputElement.getAttribute('formControlName');
    if (controlName) {
      this.control = this.formGroupDir.control.get(controlName);
    }

    if (this.control) {
      this.control.statusChanges?.subscribe(() => this.updateClasses());
      this.control.valueChanges?.subscribe(() => this.updateClasses());
    }
  }

  private updateClasses(): void {
    if (!this.control || !this.inputElement) return;

    const isTouchedOrDirty = this.control.touched || this.control.dirty;

    if (this.control.invalid && isTouchedOrDirty) {
      this.renderer.addClass(this.inputElement, 'is-invalid');
      this.renderer.removeClass(this.inputElement, 'is-valid');
    } else if (this.control.valid && isTouchedOrDirty) {
      this.renderer.addClass(this.inputElement, 'is-valid');
      this.renderer.removeClass(this.inputElement, 'is-invalid');
    } else {
      this.renderer.removeClass(this.inputElement, 'is-invalid');
      this.renderer.removeClass(this.inputElement, 'is-valid');
    }

    this.renderError();
  }

  private renderError(): void {
    if (!this.control) return;

    // remove old error under host element
    const hostEl = this.host.nativeElement as HTMLElement;
    const existing = hostEl.querySelector('.invalid-feedback.auto');
    if (existing) {
      this.renderer.removeChild(hostEl, existing);
    }

    if (this.control.invalid && (this.control.touched || this.control.dirty)) {
      const errorDiv = this.renderer.createElement('div');
      this.renderer.addClass(errorDiv, 'invalid-feedback');
      this.renderer.addClass(errorDiv, 'auto');

      const firstKey = Object.keys(this.control.errors || {})[0];
      const message = this.getErrorMessage(firstKey, this.control.errors?.[firstKey]);
      const text = this.renderer.createText(message);

      this.renderer.appendChild(errorDiv, text);
      this.renderer.appendChild(hostEl, errorDiv);
    }
  }

  private getErrorMessage(errorKey: string, errorValue?: any): string {
    switch (errorKey) {
      case 'required': return 'This field is required.';
      case 'email': return 'Please enter a valid email address.';
      case 'minlength': return `Minimum length is ${errorValue.requiredLength}.`;
      case 'maxlength': return `Maximum length is ${errorValue.requiredLength}.`;
      case 'min': return `Minimum value is ${errorValue.min}.`;
      case 'max': return `Maximum value is ${errorValue.max}.`;
      default: return 'Invalid field.';
    }
  }
}
