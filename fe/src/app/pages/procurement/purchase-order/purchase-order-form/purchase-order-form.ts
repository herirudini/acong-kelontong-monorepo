import { Component } from '@angular/core';
import { AlertService } from '../../../../shared/components/alert/alert-service';
import { formType } from '../../../../types/interfaces/common.interface';
import { PurchaseOrderService } from '../purchase-order.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseOrderForm1 } from '../purchase-order-form1/purchase-order-form1';
import { PurchaseOrderItem } from '../purchase-order-item/purchase-order-item';
import { PurchaseOrderDetail } from '../purchase-order-detail/purchase-order-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { IPurchasing, IPurchasingItem } from '../../../../types/interfaces/procurement.interface';

@Component({
  selector: 'app-purchase-order-form',
  imports: [NgbNavModule, PurchaseOrderForm1, PurchaseOrderItem, PurchaseOrderDetail],
  templateUrl: './purchase-order-form.html',
  styleUrl: './purchase-order-form.scss'
})
export class PurchaseOrderForm {
  type: formType = 'new';
  purchasingDetail?: IPurchasing;
  purchasingItems: IPurchasingItem[] = [];
  activeStep: number = 1;

  constructor(private route: ActivatedRoute) {
    const type = this.route.snapshot.queryParamMap.get('type') || undefined;
    if (type && ['new', 'edit'].includes(type)) {
      this.type = type as formType;
    }
  }

  submitPO() {
    this.nextStep();
  }

  nextStep() {
    if (this.activeStep < 3)
      this.activeStep += 1;
  }

  prevStep() {
    if (this.activeStep > 1) {
      this.activeStep -= 1;
    }
  }
}
