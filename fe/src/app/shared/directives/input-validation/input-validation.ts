import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgControl } from '@angular/forms';

@Directive({
  selector: '[appInputValidation]'
})
export class InputValidation {
  private control: AbstractControl | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngControl: NgControl,
    private formGroupDir: FormGroupDirective
  ) { }

  ngOnInit(): void {
    this.control = this.ngControl.control;

    if (this.control) {
      this.control.statusChanges?.subscribe(() => {
        this.updateClasses();
      });
      this.control.valueChanges?.subscribe(() => {
        this.updateClasses();
      });
    }
  }

  private updateClasses(): void {
    if (!this.control) return;

    const element = this.el.nativeElement;
    const isTouchedOrDirty = this.control.touched || this.control.dirty;

    if (this.control.invalid && isTouchedOrDirty) {
      this.renderer.addClass(element, 'is-invalid');
      this.renderer.removeClass(element, 'is-valid');
    } else if (this.control.valid && isTouchedOrDirty) {
      this.renderer.addClass(element, 'is-valid');
      this.renderer.removeClass(element, 'is-invalid');
    } else {
      this.renderer.removeClass(element, 'is-invalid');
      this.renderer.removeClass(element, 'is-valid');
    }
  }
}
