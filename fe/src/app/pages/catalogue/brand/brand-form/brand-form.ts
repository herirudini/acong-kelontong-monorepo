import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidation } from '../../../../shared/directives/form-validation/form-validation';
import { AlertService } from '../../../../shared/components/alert/alert-service';
import { BrandService } from '../brand-service';
import { formType } from '../../../../types/interfaces/common.interface';

@Component({
  selector: 'app-brand-form',
  imports: [ReactiveFormsModule, FormValidation],
  templateUrl: './brand-form.html',
  styleUrl: './brand-form.scss'
})
export class BrandForm implements OnInit, AfterViewInit {
  @Input() type: formType = 'new';
  @Input() id?: string;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>()

  isLoading: boolean = false;

  form: FormGroup = new FormGroup({
    brand_name: new FormControl(null, [Validators.required]),
    brand_description: new FormControl(null),
  });

  constructor(private brandService: BrandService, private alert: AlertService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.id) {
      this.brandService.getBrandDetail(this.id).subscribe((res) => {
        const { brand_name, brand_description } = res
        this.form.patchValue({
          brand_name,
          brand_description,
        });
        console.log('this.form.value', this.form.value)
      })
    }
  }

  submit() {
    if (this.form.invalid) return this.alert.error('Please check your inputs');
    const body = this.form.value;
    let serviceArgs = this.brandService.createBrand(body);
    if (this.type === 'edit' && this.id) serviceArgs = this.brandService.editBrand(this.id, body);
    serviceArgs.subscribe((res) => {
      this.alert.success(`Success ${this.type == 'edit' ? 'edit' : 'invite'} brand!`);
      this.close.emit(true);
    })
  }
}

