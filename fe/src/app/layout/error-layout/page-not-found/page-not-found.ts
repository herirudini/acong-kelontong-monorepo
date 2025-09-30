import { Component } from '@angular/core';
import { Alert } from '../../../shared/components/alert/alert';
import { PageSpinner } from '../../../shared/components/page-spinner/page-spinner';

@Component({
  selector: 'app-page-not-found',
  imports: [Alert, PageSpinner],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss'
})
export class PageNotFound {

}
