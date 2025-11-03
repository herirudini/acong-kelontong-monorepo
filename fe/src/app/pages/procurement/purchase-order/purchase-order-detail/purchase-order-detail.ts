import { Component, EventEmitter, Output } from '@angular/core';
import { PurchasingDetail } from '../../purchasing-detail/purchasing-detail';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-purchase-order-detail',
  imports: [PurchasingDetail],
  templateUrl: './purchase-order-detail.html',
  styleUrl: './purchase-order-detail.scss'
})
export class PurchaseOrderDetail {
  @Output() nextStep: EventEmitter<unknown> = new EventEmitter<unknown>()
  @Output() back: EventEmitter<unknown> = new EventEmitter<unknown>()

  purchase_id?: string;

  constructor(private route: ActivatedRoute) {
    this.purchase_id = this.route.snapshot.paramMap.get('po_id') || undefined;
  }

}
