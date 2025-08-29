import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageSpinnerService {
    private spinnerStatus = new Subject<'on'|'off'>();
    getSpinnerStatus() {
        return this.spinnerStatus.asObservable();
    }
    spinnerOn() {
        this.spinnerStatus.next('on');
    }
    spinnerOff() {
        this.spinnerStatus.next('off');
    }
}
