import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { FormGroupDirective, AbstractControl, FormArray, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appFormValidation]' // place this on <form>
})
export class FormValidation implements OnInit {

  constructor(
    private formGroupDir: FormGroupDirective,
    private el: ElementRef<HTMLFormElement>,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    // Listen to status changes at the form level
    this.formGroupDir.form.statusChanges.subscribe(() => {
      this.applyValidationStates(this.formGroupDir.form);
    });
  }

  // 👇 Catch the submit event on the form
  @HostListener('ngSubmit', ['$event'])
  onNgSubmit(event: Event): void {
    if (this.formGroupDir.form.invalid) {
      this.markFormGroupTouched(this.formGroupDir.form);
      this.applyValidationStates(this.formGroupDir.form);
    }
  }

  private markFormGroupTouched(control: AbstractControl) {
    if (control instanceof FormGroup || control instanceof FormArray) {
      Object.values(control.controls).forEach(innerControl =>
        this.markFormGroupTouched(innerControl)
      );
    } else {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }


  private applyValidationStates(group: FormGroup | FormArray): void {
    Object.keys(group.controls).forEach(controlName => {
      const control = group.controls[controlName];

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.applyValidationStates(control); // recurse
      } else {
        const element = this.el.nativeElement.querySelector(
          `[formControlName="${controlName}"]`
        ) as HTMLElement | null;

        if (element) {
          this.updateClasses(control, element);
          this.renderError(control, element);
        }
      }
    });
  }


  private updateClasses(control: AbstractControl, element: HTMLElement): void {
    const isTouchedOrDirty = control.touched || control.dirty;

    if (control.invalid && isTouchedOrDirty) {
      this.renderer.addClass(element, 'is-invalid');
      this.renderer.removeClass(element, 'is-valid');
    } else if (control.valid && isTouchedOrDirty) {
      this.renderer.addClass(element, 'is-valid');
      this.renderer.removeClass(element, 'is-invalid');
    } else {
      this.renderer.removeClass(element, 'is-invalid');
      this.renderer.removeClass(element, 'is-valid');
    }
  }

  private renderError(control: AbstractControl, element: HTMLElement): void {
    // remove old error first
    const parent = element.parentElement;
    if (!parent) return;

    const existing = parent.querySelector('.invalid-feedback.auto');
    if (existing) {
      this.renderer.removeChild(parent, existing);
    }

    if (control.invalid && (control.touched || control.dirty)) {
      const errorDiv = this.renderer.createElement('div');
      this.renderer.addClass(errorDiv, 'invalid-feedback');
      this.renderer.addClass(errorDiv, 'auto');

      const firstKey = Object.keys(control.errors || {})[0];
      const message = this.getErrorMessage(firstKey, control.errors?.[firstKey]);
      const text = this.renderer.createText(message);

      this.renderer.appendChild(errorDiv, text);
      this.renderer.appendChild(parent, errorDiv);
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
