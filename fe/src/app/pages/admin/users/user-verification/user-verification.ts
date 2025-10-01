import { Component } from '@angular/core';
import { Alert } from '../../../../shared/components/alert/alert';
import { PageSpinner } from '../../../../shared/components/page-spinner/page-spinner';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../users-service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../shared/components/alert/alert-service';
import { InputValidation } from '../../../../shared/directives/input-validation/input-validation';

@Component({
  selector: 'app-user-verification',
  imports: [Alert, PageSpinner, ReactiveFormsModule, InputValidation],
  templateUrl: './user-verification.html',
  styleUrl: './user-verification.scss'
})
export class UserVerification {

  form: FormGroup = new FormGroup({
    ticket: new FormControl(null, [Validators.required]),
    new_password: new FormControl(null, [Validators.required]),
    confirm_password: new FormControl(null, [Validators.required]),
  });

  constructor(private service: UsersService, private route: ActivatedRoute, private alert: AlertService) {
    const ticket = this.route.snapshot.paramMap.get('ticket') || undefined;
    if (ticket) this.form.controls.ticket.patchValue(ticket);
  }

  passwordMatch() {
    const val = this.form.value;
    return val.new_password == val.confirm_password;
  }

  submit() {
    console.log('this.form.invalid', this.form.invalid);
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return
    }
    this.service.verifyUser(this.form.value).subscribe({
      next: (res) => {
        this.alert.success('Verification success');
        setTimeout(() => {
          window.location.href = "/login"
        }, 1000)
      },
      error: (err) => {
        this.alert.error('Verification failed')
      }
    })
  }
}
