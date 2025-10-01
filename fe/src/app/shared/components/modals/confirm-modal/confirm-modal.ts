import { Component, TemplateRef, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss'
})
export class ConfirmModal {
  @Input() type: 'delete' | 'action' = 'delete';
  @Output() submit: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Input() itemName: string = "this item";
  @Input() customText?: string;
  @ViewChild('modalTemplateRef') modalTemplateRef!: TemplateRef<any>;
  modalRef!: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  show(): EventEmitter<boolean> {
    if (this.modalTemplateRef) {
      this.modalRef = this.modalService.open(this.modalTemplateRef, { ariaLabelledBy: 'modal-basic-title' });
    } else console.error('Template reference "modalTemplateRef" is not available.');
    return this.submit
  }

  ok() {
    if (this.modalRef) {
      this.submit.emit(true);
      this.modalRef.dismiss(true);
    }
  }
}
