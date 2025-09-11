import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDateRangeFilter } from '../../../types/interfaces/common.interface';

@Component({
  selector: 'app-date-range-filter',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './date-range-filter.html',
  styleUrl: './date-range-filter.scss'
})
export class DateRangeFilter implements OnChanges {
  @Input() patchedValue?: IDateRangeFilter;
  value: IDateRangeFilter | undefined;
  @Output() OnChanges: EventEmitter<IDateRangeFilter> = new EventEmitter<IDateRangeFilter>();
  expanded: boolean = false;
  datesForm: FormGroup;

  constructor(private elementRef: ElementRef, private fb: FormBuilder) {
    this.datesForm = this.fb.group({
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]]
    })
  }
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: any) {
    // Check if the clicked target is outside the dropdown component
    if (!this.elementRef.nativeElement.contains(target)) {
      this.expanded = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patchedValue']) {
      if (this.patchedValue) {
        this.value = { start_date: this.patchedValue.start_date, end_date: this.patchedValue.end_date };
        this.datesForm.patchValue(this.value);
        console.log('this.datesForm.valu', this.patchedValue, this.datesForm.value)
      }
    }
  }

  reset() {
    this.datesForm.reset();
    this.value = undefined;
  }
  submit() {
    this.value = this.datesForm.value;
    this.OnChanges.emit(this.datesForm.value);
  }
}
