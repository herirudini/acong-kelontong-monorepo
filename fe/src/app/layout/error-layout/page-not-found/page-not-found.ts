import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alert } from '../../../shared/components/alert/alert';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink, Alert],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss'
})
export class PageNotFound {

}
