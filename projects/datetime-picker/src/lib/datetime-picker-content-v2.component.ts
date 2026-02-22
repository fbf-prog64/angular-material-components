import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, ThemePalette } from '@angular/material/core';
import { MatCalendar, MatCalendarView } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxMatTimepickerComponent } from './timepicker.component';

export interface NgxMatDatetimePickerContentData<D> {
  datepicker: any; // Reference to the main datepicker component
  color?: ThemePalette;
  touchUi?: boolean;
  hideTime?: boolean;
  showSpinners?: boolean;
  showSeconds?: boolean;
  stepHour?: number;
  stepMinute?: number;
  stepSecond?: number;
  enableMeridian?: boolean;
  defaultTime?: [number, number, number];
  preventOverlayClick?: boolean;
  disabled?: boolean;
  startView?: MatCalendarView;
  minDate?: D | null;
  maxDate?: D | null;
  dateFilter?: (date: D) => boolean;
  value?: D | null;
}

@Component({
  selector: 'ngx-mat-datetime-picker-content-v2',
  template: `
    <div
      class="ngx-mat-datetime-picker-content"
      [class.ngx-mat-datetime-picker-content-touch]="data.touchUi">
      <mat-calendar
        #calendar
        [startView]="data.startView || 'month'"
        [startAt]="selectedDate() || data.value!"
        [minDate]="data.minDate!"
        [maxDate]="data.maxDate!"
        [dateFilter]="data.dateFilter"
        [selected]="selectedDate()"
        (selectedChange)="onDateSelected($event)"
        (yearSelected)="onYearSelected($event)"
        (monthSelected)="onMonthSelected($event)">
      </mat-calendar>

      @if (!data.hideTime) {
        <div class="ngx-mat-datetime-picker-time">
          <ngx-mat-timepicker
            #timepicker
            [ngModel]="selectedDateTime()"
            (ngModelChange)="onTimeChanged($event)"
            [color]="data.color!"
            [showSpinners]="data.showSpinners ?? true"
            [showSeconds]="data.showSeconds ?? false"
            [stepHour]="data.stepHour ?? 1"
            [stepMinute]="data.stepMinute ?? 1"
            [stepSecond]="data.stepSecond ?? 1"
            [enableMeridian]="data.enableMeridian ?? false"
            [defaultTime]="data.defaultTime"
            [disabled]="data.disabled!">
          </ngx-mat-timepicker>
        </div>
      }

      <div class="ngx-mat-datetime-picker-actions">
        <button
          mat-button
          type="button"
          class="ngx-mat-datetime-picker-cancel-button"
          (click)="onCancel()">
          Cancelar
        </button>
        <button
          mat-button
          type="button"
          class="ngx-mat-datetime-picker-apply-button"
          [color]="data.color"
          (click)="onApply()">
          Aplicar
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./datetime-picker-content-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, MatCalendar, MatButtonModule, NgxMatTimepickerComponent],
  host: {
    class: 'ngx-mat-datetime-picker-content-v2',
    '[class.ngx-mat-datetime-picker-content-touch]': 'data.touchUi',
  },
})
export class NgxMatDatetimePickerContentV2<D> implements OnInit, OnDestroy {
  @ViewChild('calendar', { static: true }) calendar!: MatCalendar<D>;
  @ViewChild('timepicker', { static: false }) timepicker!: NgxMatTimepickerComponent<D>;

  readonly dialogRef = inject(MatDialogRef<NgxMatDatetimePickerContentV2<D>>);
  readonly data = inject<NgxMatDatetimePickerContentData<D>>(MAT_DIALOG_DATA);
  private readonly _dateAdapter = inject(DateAdapter<D>);
  private readonly _destroyed = new Subject<void>();

  // Signals for reactive state management
  readonly selectedDate = signal<D | null>(this.data.value || null);
  readonly selectedDateTime = signal<D | null>(this.data.value || null);

  constructor() {
    // Initialize values once without effects to avoid reset loops
    const initialValue = this.data.value;
    if (initialValue) {
      this.selectedDate.set(initialValue);
      this.selectedDateTime.set(initialValue);
    }
  }

  ngOnInit(): void {
    // Listen for calendar changes
    if (this.calendar) {
      this.calendar.selectedChange
        .pipe(takeUntil(this._destroyed))
        .subscribe((date) => this.onDateSelected(date));
    }

    // Prevent dialog close on overlay click if configured
    if (this.data.preventOverlayClick) {
      this.dialogRef.disableClose = true;
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  onDateSelected(date: D | null): void {
    console.log('Date selected:', date);
    this.selectedDate.set(date);

    if (date) {
      if (this.data.hideTime) {
        this.selectedDateTime.set(date);
      } else {
        // Preserve the current time when selecting a new date
        const currentDateTime = this.selectedDateTime();
        if (currentDateTime) {
          const timeArray = this._extractTimeFromDate(currentDateTime);
          const newDateTime = this._combineDateTime(date, timeArray);
          this.selectedDateTime.set(newDateTime);
        } else {
          // If no time is set, use default time
          const defaultTime = this._getDefaultTime();
          const newDateTime = this._combineDateTime(date, defaultTime);
          this.selectedDateTime.set(newDateTime);
        }
      }
    } else {
      this.selectedDateTime.set(null);
    }
  }

  onYearSelected(year: D): void {
    // Let the calendar handle year selection
  }

  onMonthSelected(month: D): void {
    // Let the calendar handle month selection
  }

  onTimeChanged(time: D | null): void {
    console.log('⏰ Time changed:', time);
    if (time) {
      // Combine the current selected date with the new time
      const currentDate = this.selectedDate();
      console.log('📅 Current date for time combination:', currentDate);
      if (currentDate) {
        // Use the existing _combineDateTime method but with the time from the timepicker
        const timeArray = this._extractTimeFromDate(time);
        const newDateTime = this._combineDateTime(currentDate, timeArray);
        console.log('🕐 Combined datetime:', newDateTime);
        this.selectedDateTime.set(newDateTime);
      } else {
        console.log('🕐 No current date, using time as-is');
        this.selectedDateTime.set(time);
      }
    }
  }

  onApply(): void {
    const result = this.data.hideTime ? this.selectedDate() : this.selectedDateTime();
    console.log('✅ Dialog onApply - returning result:', result);
    this.dialogRef.close(result);
  }

  onCancel(): void {
    console.log('❌ Dialog onCancel');
    this.dialogRef.close();
  }

  private _getDefaultTime(): [number, number, number] {
    if (this.data.defaultTime) {
      return [...this.data.defaultTime];
    }

    if (this.data.value) {
      return this._extractTimeFromDate(this.data.value);
    }

    const now = new Date();
    return [now.getHours(), now.getMinutes(), now.getSeconds()];
  }

  private _extractTimeFromDate(date: D): [number, number, number] {
    const hours = this._dateAdapter.getHours(date);
    const minutes = this._dateAdapter.getMinutes(date);
    const seconds = this._dateAdapter.getSeconds(date);
    return [hours, minutes, seconds];
  }

  private _combineDateTime(date: D, time: [number, number, number]): D {
    const clonedDate = this._dateAdapter.clone(date);
    const jsDate = this._dateAdapter.toIso8601(clonedDate);
    const dateObj = new Date(jsDate);

    dateObj.setHours(time[0] || 0);
    dateObj.setMinutes(time[1] || 0);
    dateObj.setSeconds(time[2] || 0);
    dateObj.setMilliseconds(0);

    return this._dateAdapter.deserialize(dateObj.toISOString()) as D;
  }
}
