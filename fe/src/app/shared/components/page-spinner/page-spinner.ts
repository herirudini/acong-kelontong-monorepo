import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { PageSpinnerService } from './page-spinner-service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-page-spinner',
  templateUrl: './page-spinner.html',
  styleUrls: ['./page-spinner.scss']
})
export class PageSpinner {
  isSpinning: boolean = false;

  constructor(
    private pageSpinnerService: PageSpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.pageSpinnerService.getSpinnerStatus().subscribe((status: 'on' | 'off') => {
        console.log('getSpinnerStatus', status);
        this.isSpinning = status === 'on';
      });
    }
  }
}
