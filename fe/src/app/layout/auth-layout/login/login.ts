import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alert } from '../../../shared/components/alert/alert';
import { PageSpinner } from '../../../shared/components/page-spinner/page-spinner';

@Component({
  selector: 'app-login',
  imports: [RouterLink, Alert, PageSpinner],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

}
