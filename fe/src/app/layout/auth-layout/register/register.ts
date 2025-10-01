import { Component } from '@angular/core';
import { Alert } from '../../../shared/components/alert/alert';
import { PageSpinner } from '../../../shared/components/page-spinner/page-spinner';

@Component({
  selector: 'app-register',
  imports: [Alert, PageSpinner],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

}
