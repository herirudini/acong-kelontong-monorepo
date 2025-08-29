import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alert } from '../../../shared/components/alert/alert';
import { PageSpinner } from '../../../shared/components/page-spinner/page-spinner';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink, Alert, PageSpinner],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss'
})
export class PageNotFound {

}
