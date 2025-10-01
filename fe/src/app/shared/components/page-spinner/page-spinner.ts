import { Component } from '@angular/core';
import { PageSpinnerService } from './page-spinner-service';

@Component({
  selector: 'app-page-spinner',
  templateUrl: './page-spinner.html',
  styleUrls: ['./page-spinner.scss']
})
export class PageSpinner {
  isSpinning?: boolean;

  constructor(
    private pageSpinnerService: PageSpinnerService,
  ) {
    this.pageSpinnerService.getSpinnerStatus().subscribe((status: 'on' | 'off') => {
      this.isSpinning = status === 'on';
    });
  }
}
