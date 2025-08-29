import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertType, IAlert } from './alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public subjectAlert = new Subject<IAlert>();
  public removeAlert = new Subject<IAlert['alertId']>();
  public clearAll = new Subject<boolean>;

  alertQueue: number[] = [];

  private generateAlertQueue(): number {
    let lastNum;
    let newNum: number;
    if (this.alertQueue.length===0) {
      this.alertQueue.push(1);
      newNum = 1;
    } else {
      const total = this.alertQueue.length>0? this.alertQueue.length : 1;
      lastNum = this.alertQueue[total-1];
      newNum = lastNum+1;
      this.alertQueue.push(newNum);
    }
    return newNum;
  }

  // convenience methods
  success(message: string) {
    this.prepareAlert(AlertType.Success, message);
  }

  error(message: string) {
    this.prepareAlert(AlertType.Error, message);
  }

  info(message: string) {
    this.prepareAlert(AlertType.Info, message);
  }

  warn(message: string) {
    this.prepareAlert(AlertType.Warning, message);
  }

  prepareAlert(type: AlertType, message: string) {
    this.trigger(new IAlert({ message, type, alertId: this.generateAlertQueue() }));
  }

  // main trigger method
  trigger(alert: IAlert) {
    this.subjectAlert.next(alert);
    setTimeout(() => {
      this.clear(alert.alertId);
    }, 4000);
  }

  // clear alerts
  clear(alertId: number) {
    this.removeAlert.next(alertId);
    this.alertQueue = this.alertQueue.filter((el)=>el!==alertId);
  }
}
