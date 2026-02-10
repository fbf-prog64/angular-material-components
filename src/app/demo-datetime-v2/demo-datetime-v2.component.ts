import { DatePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatetimePickerInputV2 } from '../../../projects/datetime-picker/src/lib/datetime-picker-input-v2.directive';
import { NgxMatDatetimePickerV2 } from '../../../projects/datetime-picker/src/lib/datetime-picker-v2.component';
import { NgxMatHighlightDirective } from '../shared/NgxMatHighlightDirective';

@Component({
  selector: 'app-demo-datetime-v2',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxMatDatetimePickerV2,
    NgxMatDatetimePickerInputV2,
    NgxMatHighlightDirective,
    DatePipe,
  ],
  template: `
    <div class="demo-container">
      <h2>NgxMatDatetimePicker V2 Demo</h2>
      <p>This is the new implementation that uses native Angular Material with integrated timepicker.</p>

      <pre>
        <code ngxMatHighlight class="language-typescript">{{code1}}</code>

        <code ngxMatHighlight class="language-html">{{code2}}</code>
      </pre>

      <div class="example-section">
        <h3>Basic Example</h3>
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
        </mat-form-field>
      </div>

      <div class="example-section">
        <h3>Basic Example with Min/Max Dates</h3>
        <mat-form-field appearance="outline">
          <mat-label>Date and Time</mat-label>
          <input
            matInput
            [formControl]="datetimeControl"
            [ngxMatDatetimePicker]="datetimePickerWithMinMax"
            [min]="minDate()"
            [max]="maxDate()"
            placeholder="Select date and time">
          <ngx-mat-datetime-picker
            #datetimePickerWithMinMax
            [hideTime]="false"
            [showSpinners]="true"
            [showSeconds]="false"
            [stepHour]="1"
            [stepMinute]="15">
          </ngx-mat-datetime-picker>
        </mat-form-field>
      </div>

      <div class="example-section">
        <h3>Date Only (no time)</h3>
        <mat-form-field appearance="outline">
          <mat-label>Date</mat-label>
          <input
            matInput
            [formControl]="dateOnlyControl"
            [ngxMatDatetimePicker]="dateOnlyPicker"
            placeholder="Select date only">
          <ngx-mat-datetime-picker
            #dateOnlyPicker
            [hideTime]="true">
          </ngx-mat-datetime-picker>
        </mat-form-field>
      </div>

      <div class="example-section">
        <h3>With Seconds and 12-hour Format</h3>
        <mat-form-field appearance="outline">
          <mat-label>Full Date and Time</mat-label>
          <input
            matInput
            [formControl]="fullDatetimeControl"
            [ngxMatDatetimePicker]="fullDatetimePicker"
            placeholder="Date with seconds and AM/PM">
          <ngx-mat-datetime-picker
            #fullDatetimePicker
            [hideTime]="false"
            [showSpinners]="true"
            [showSeconds]="true"
            [enableMeridian]="true"
            [stepHour]="1"
            [stepMinute]="5"
            [stepSecond]="10">
          </ngx-mat-datetime-picker>
        </mat-form-field>
      </div>

      <div class="values-section">
        <h3>Current Values</h3>
        <p><strong>Basic datetime:</strong> {{ datetimeControl.value | date:'short' }}</p>
        <p><strong>Date only:</strong> {{ dateOnlyControl.value | date:'mediumDate' }}</p>
        <p><strong>Full datetime:</strong> {{ fullDatetimeControl.value | date:'full' }}</p>

        <div class="debug-info">
          <h4>Debug Info (check console for logs)</h4>
          <p><strong>Form Status:</strong> {{ datetimeControl.status }}</p>
          <p><strong>Raw Values:</strong></p>
          <pre>{{ getDebugInfo() }}</pre>
        </div>
      </div>

      <div class="actions-section">
        <button mat-raised-button color="primary" (click)="setCurrentDateTime()">
          Set Current Date/Time
        </button>
        <button mat-raised-button (click)="clearValues()">
          Clear Values
        </button>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .example-section {
      margin-bottom: 30px;
    }

    .example-section h3 {
      margin-bottom: 15px;
      color: #1976d2;
    }

    mat-form-field {
      width: 100%;
      max-width: 400px;
    }

    .values-section {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .values-section p {
      margin: 8px 0;
    }

    .actions-section {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .actions-section button {
      margin: 5px;
    }

    .debug-info {
      margin-top: 20px;
      border-top: 1px solid #ddd;
      padding-top: 15px;
    }

    .debug-info h4 {
      color: #666;
      margin-bottom: 10px;
    }

    .debug-info pre {
      background-color: #f0f0f0;
      padding: 10px;
      border-radius: 4px;
      font-size: 12px;
      overflow-x: auto;
    }
  `]
})
export class DemoDatetimeV2Component {
  datetimeControl = new FormControl(new Date());
  dateOnlyControl = new FormControl(null);
  fullDatetimeControl = new FormControl(null);

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
    return new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate() + 32, minDate.getHours(), minDate.getMinutes(), minDate.getSeconds());
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
