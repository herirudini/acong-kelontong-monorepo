import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alert } from '../../../shared/components/alert/alert';

@Component({
  selector: 'app-login',
  imports: [RouterLink, Alert],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

}
