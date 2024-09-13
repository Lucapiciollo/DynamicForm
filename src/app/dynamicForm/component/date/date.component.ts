/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */

import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../bsae-component.component';
import { MatCalendar, MatDatepicker } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { Delay } from 'pl-decorator';
import { MatInput } from '@angular/material/input';

declare var window: any
@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})

export class DateComponent extends BaseComponent {

  /************************************************************************************************************************************************************************ */


  private _datarangeinput: MatDatepicker<Date>;

  private obs: Subscription;

  @ViewChild("datepicker") set datarangeinput(datarangeinput: MatDatepicker<Date>) {
    if (!this.obs) {
      this.obs = new Subscription();
    }
    if (datarangeinput) {
      this._datarangeinput = datarangeinput;
    }
  };

  /************************************************************************************************************************************************************************ */



  openedStream(eve, datainput: MatInput) {

    if (!this.obs) {
      this.obs = new Subscription();
    }
    setTimeout((datainput) => {

      Array.from(document.getElementsByTagName("mat-calendar"), (element => {
        let instanceMatCalendar = window.ng.getComponent(element) as MatCalendar<Date>;
        this.obs.add(instanceMatCalendar.monthView.selectedChange.subscribe(response => { this.stopOutFocus(datainput) }));
        ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("touchmove", this.stopOutFocus.bind(this, datainput));
        ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("mouseenter", this.stopOutFocus.bind(this, datainput));
        ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("focus", this.stopOutFocus.bind(this, datainput));
        ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("mouseleave", this.stopOutFocus.bind(this, datainput));
        ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("blur", this.stopOutFocus.bind(this, datainput));
        ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("mousedown", this.stopOutFocus.bind(this, datainput));
        ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("touchstart", this.stopOutFocus.bind(this, datainput));
        this.obs.add(instanceMatCalendar.monthView.dragStarted.subscribe(response => { this.stopOutFocus(datainput); }));
        this.obs.add(instanceMatCalendar.monthView.dragEnded.subscribe(response => { this.stopOutFocus(datainput); }));
      }))
    }, 110, datainput);
  }
  /************************************************************************************************************************************************************************ */
  closedStream(eve) {
    Array.from(document.getElementsByTagName("mat-calendar"), (element => {
      let instanceMatCalendar = window.ng.getComponent(element) as MatCalendar<Date>;
      ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("touchmove", this.stopOutFocus);
      ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("mouseenter", this.stopOutFocus);
      ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("focus", this.stopOutFocus);
      ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("mouseleave", this.stopOutFocus);
      ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("blur", this.stopOutFocus);
      ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("mousedown", this.stopOutFocus);
      ((instanceMatCalendar.monthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("touchstart", this.stopOutFocus);
    }))

    this.obs.unsubscribe();
  }
  @Delay(0)
  stopOutFocus(datainput) {
    datainput.focus()
  }

  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);

  }
  /************************************************************************************************************************************************************************ */


}
