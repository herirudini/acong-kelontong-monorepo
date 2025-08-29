import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alert } from '../../../shared/components/alert/alert';

@Component({
  selector: 'app-register',
  imports: [RouterLink, Alert],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

}
