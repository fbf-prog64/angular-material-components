import { DatePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatetimePickerInputV2, NgxMatDatetimePickerV2 } from '@ngx-mce/datetime-picker';
import { NgxMatHighlightDirective } from '../shared/NgxMatHighlightDirective';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-demo-datetime-v2',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    NgxMatDatetimePickerV2,
    NgxMatDatetimePickerInputV2,
    NgxMatHighlightDirective,
    DatePipe,
  ],
  templateUrl: "./demo-datetime-v2.component.html",
  styleUrls: ["./demo-datetime-v2.component.scss"]
})
export class DemoDatetimeV2Component {
  datetimeControl = new FormControl<Date>(new Date());
  dateOnlyControl = new FormControl<Date | null>(null);
  fullDatetimeControl = new FormControl<Date | null>(null);

  public code1 = `
  import {
    NgxMatDatetimePickerV2,
    NgxMatDatetimePickerInputV2,
  } from '@ngx-mce/datetime-picker';

  @Component({
    imports: [
      ...
      NgxMatDatetimePickerV2,
      NgxMatDatetimePickerInputV2,
      ...
    ]
  })
  export class AppComponent { }`;

  public code2 = `
    <mat-form-field appearance="outline">
      <mat-label>Date and Time</mat-label>
      <input
        matInput
        [formControl]="datetimeControl"
        [ngxMatDatetimePicker]="datetimePicker"
        placeholder="Select date and time">
      <ngx-mat-datetime-picker
        #datetimePicker
        [hideTime]="false"
        [showSpinners]="true"
        [showSeconds]="false"
        [stepHour]="1"
        [stepMinute]="15">
      </ngx-mat-datetime-picker>
    </mat-form-field>`;

  protected readonly minDate = toSignal(this.datetimeControl.valueChanges, { initialValue: new Date() });
  protected readonly maxDate = computed(() => {
    const minDate = this.minDate();
    return new Date(
      minDate!.getFullYear(), minDate!.getMonth(), minDate!.getDate() + 32,
      minDate!.getHours(), minDate!.getMinutes(), minDate!.getSeconds()
    );
  });

  constructor() {
    // Monitor form control changes
    this.datetimeControl.valueChanges.subscribe(value => {
      console.log('🔄 datetimeControl value changed to:', value);
    });

    this.dateOnlyControl.valueChanges.subscribe(value => {
      console.log('🔄 dateOnlyControl value changed to:', value);
    });

    this.fullDatetimeControl.valueChanges.subscribe(value => {
      console.log('🔄 fullDatetimeControl value changed to:', value);
    });
  }

  getDebugInfo(): string {
    return JSON.stringify({
      datetime: this.datetimeControl.value,
      dateOnly: this.dateOnlyControl.value,
      fullDatetime: this.fullDatetimeControl.value
    }, null, 2);
  }

  setCurrentDateTime(): void {
    const now = new Date();
    this.datetimeControl.setValue(now);
    this.dateOnlyControl.setValue(now);
    this.fullDatetimeControl.setValue(now);
  }

  clearValues(): void {
    this.datetimeControl.setValue(null);
    this.dateOnlyControl.setValue(null);
    this.fullDatetimeControl.setValue(null);
  }
}
