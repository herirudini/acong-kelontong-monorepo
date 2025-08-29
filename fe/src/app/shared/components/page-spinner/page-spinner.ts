import { afterNextRender, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSpinnerService } from './page-spinner-service';

@Component({
  selector: 'app-page-spinner',
  imports: [],
  templateUrl: './page-spinner.html',
  styleUrl: './page-spinner.scss'
})
export class PageSpinner {

  @ViewChild('content') content?: ElementRef;
  private spinnerModal?: NgbModalRef;

  constructor(private modalService: NgbModal, private pageSpinnerService: PageSpinnerService) {
    afterNextRender(() => {
      this.pageSpinnerService.getSpinnerStatus().subscribe((status: 'on' | 'off') => {
        if (status === 'on') {
          this.openVerticallyCentered(this.content);
        } else {
          this.spinnerModal?.dismiss();
        }
      });
    });
  }

  openVerticallyCentered(content?: ElementRef) {
    this.spinnerModal = this.modalService.open(content, {
      backdrop: 'static',
      centered: true,
      windowClass: 'modalClass',
      keyboard: false
    });
  }

}
