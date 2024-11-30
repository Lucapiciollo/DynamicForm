import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../base-component.component';
import { MatDateRangeInput, MatMonthView } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { Delay } from 'pl-decorator';
declare var window: any
@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})
export class DateRangeComponent extends BaseComponent {

  private _datarangeinput: MatDateRangeInput<Date>;
  private obs: Subscription;
  private oldFunction;
  @ViewChild("datainput") set datarangeinput(datarangeinput: MatDateRangeInput<Date>) {
    if (!this.obs) {
      this.obs = new Subscription();
    }
    if (datarangeinput) {
      this._datarangeinput = datarangeinput;
    }

  };
  @ViewChild("input") inputs: ElementRef;

  /************************************************************************************************************************************************************************ */

  openedStream(eve) {


    if (this._datarangeinput) {
      this._datarangeinput.onContainerClick()
      this.oldFunction = this._datarangeinput._updateFocus;
      this._datarangeinput._updateFocus = () => {
        this.inputs.nativeElement.focus();
        this._datarangeinput.onContainerClick()
      };

    }
    setTimeout(() => {
      Array.from(document.getElementsByTagName("mat-month-view"), (element => {
        this._datarangeinput.onContainerClick()
        let instanceMatMonthView = window.ng.getComponent(element) as MatMonthView<Date>;
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("touchmove", this.stopOutFocus.bind(this));
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("mouseenter", this.stopOutFocus.bind(this));
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("focus", this.stopOutFocus.bind(this));
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("mouseleave", this.stopOutFocus.bind(this));
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("blur", this.stopOutFocus.bind(this));
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("mousedown", this.stopOutFocus.bind(this));
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.addEventListener("touchstart", this.stopOutFocus.bind(this));
        this.obs.add(instanceMatMonthView.dragStarted.subscribe(response => { this.stopOutFocus(); }));
        this.obs.add(instanceMatMonthView.selectedChange.subscribe(response => { this.stopOutFocus() }));
        this.obs.add(instanceMatMonthView.dragEnded.subscribe(response => { this.stopOutFocus(); }));
      }))
    }, 100);





  }
  /************************************************************************************************************************************************************************ */

  closedStream(eve) {
    this._datarangeinput._updateFocus = this.oldFunction;
    this.obs.unsubscribe();
    setTimeout(() => {
      Array.from(document.getElementsByTagName("mat-month-view"), (element => {
        this._datarangeinput.onContainerClick()
        let instanceMatMonthView = window.ng.getComponent(element) as MatMonthView<Date>;
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("touchmove", this.stopOutFocus);
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("mouseenter", this.stopOutFocus);
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("focus", this.stopOutFocus);
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("mouseleave", this.stopOutFocus);
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("blur", this.stopOutFocus);
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("mousedown", this.stopOutFocus);
        ((instanceMatMonthView._matCalendarBody as any)._elementRef).nativeElement.removeEventListener("touchstart", this.stopOutFocus);
      }))
    }, 100);

  }

  @Delay(0)
  stopOutFocus() {
    try {
      this._datarangeinput.onContainerClick()

    } catch (error) {

    }
  }

  /************************************************************************************************************************************************************************ */
  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);

  }
}
