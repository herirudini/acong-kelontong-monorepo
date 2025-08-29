import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
import { AlertService } from './alert-service';

export class IAlert {
  type: AlertType=AlertType.Info;
  message: string='';
  alertId: number=0;
  keepAfterRouteChange: boolean=true;
  constructor(init?: Partial<IAlert>) {
    Object.assign(this, init);
  }
}

export enum AlertType {
  Success = 'success',
  Error = 'danger',
  Info = 'info',
  Warning = 'warning',
  Loading = 'light',
}

@Component({
  selector: 'app-alert',
  imports: [NgbAlertModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss'
})
export class Alert implements OnInit {

  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  staticAlertClosed = false;

  alerts: IAlert[] = [];

  constructor(
    private alertService: AlertService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.alertService.subjectAlert.subscribe((alert) => {
      if (alert.message) {
        this.alerts.push(alert);
        this.cdRef.detectChanges();
      }
    });
    this.alertService.removeAlert.subscribe((id) => {
      const target = this.alerts.find((el) => el.alertId === id);
      if (target) this.closeAlert(target);
    });
    this.alertService.clearAll.subscribe((val: boolean) => {
      if (val) this.alerts = [];
      this.cdRef.detectChanges();
    });
  }

  removeAlert(alert: IAlert) {
    // remove specified alert from array
    this.alerts = this.alerts.filter((x) => x !== alert);
  }

  closeAlert(alert: IAlert) {
    const index = this.alerts.findIndex((el) => el.alertId === alert.alertId);
    this.alerts.splice(index, 1);
    this.cdRef.detectChanges();
  }
}