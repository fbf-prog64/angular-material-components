# NgxMatDatetimePicker V2 - Migration to Native Angular Material

## Description

NgxMatDatetimePickerV2 is a new implementation of the datetime-picker component that uses native
Angular Material components instead of custom implementations. This new version simplifies the code,
improves maintainability, and leverages official Angular Material improvements and updates.

## Main Changes

### Architecture

- **Before (V1)**: Custom implementation cloning Angular Material files
- **After (V2)**: Uses native `MatCalendar` from Angular Material with `MatDialog` for the popup

### Benefits

- ✅ Simpler and more maintainable code
- ✅ Leverages automatic Angular Material improvements
- ✅ Smaller bundle size
- ✅ Better compatibility with future Angular versions
- ✅ Keeps all existing timepicker functionality

## Installation and Setup

### 1. Import the Module

```typescript
import { NgxMatDatetimePickerV2, NgxMatDatetimePickerInputV2 } from '@ngx-mce/datetime-picker';

@NgModule({
  imports: [
    // ... other imports
    NgxMatDatetimePickerV2,
    NgxMatDatetimePickerInputV2,
  ],
})
export class AppModule {}
```

### 2. Basic Usage

```html
<mat-form-field>
  <mat-label>Date and Time</mat-label>
  <input matInput [ngxMatDatetimePicker]="picker" [(ngModel)]="selectedDateTime" />
  <ngx-mat-datetime-picker #picker></ngx-mat-datetime-picker>
</mat-form-field>
```

### 3. With Reactive Forms

```typescript
// In the component
datetimeControl = new FormControl(new Date());
```

```html
<mat-form-field>
  <mat-label>Date and Time</mat-label>
  <input matInput [formControl]="datetimeControl" [ngxMatDatetimePicker]="picker" />
  <ngx-mat-datetime-picker #picker></ngx-mat-datetime-picker>
</mat-form-field>
```

## Options Configuration

### Picker Properties

```html
<ngx-mat-datetime-picker
  #picker
  [hideTime]="false"           <!-- Show/hide time selector -->
  [showSpinners]="true"        <!-- Show increment buttons -->
  [showSeconds]="false"        <!-- Show seconds selector -->
  [stepHour]="1"               <!-- Hour increment -->
  [stepMinute]="15"            <!-- Minute increment -->
  [stepSecond]="10"            <!-- Second increment -->
  [enableMeridian]="false"     <!-- 12-hour format (AM/PM) -->
  [color]="'primary'"          <!-- Theme color -->
  [touchUi]="false"            <!-- Touch-optimized UI -->
  [disabled]="false"           <!-- Disable the picker -->
  [startView]="'month'"        <!-- Initial view: 'month' | 'year' | 'multi-year' -->
  [defaultTime]="[12, 0, 0]">  <!-- Default time [hours, minutes, seconds] -->
</ngx-mat-datetime-picker>
```

### Input Properties

```html
<input
  matInput
  [ngxMatDatetimePicker]="picker"
  [min]="minDate"              <!-- Minimum date -->
  [max]="maxDate"              <!-- Maximum date -->
  [dateFilter]="myFilter"      <!-- Filter function -->
  [disabled]="false">          <!-- Disable input -->
```

## Usage Examples

### Date Only (no time)

```html
<mat-form-field>
  <mat-label>Date</mat-label>
  <input matInput [ngxMatDatetimePicker]="datePicker" />
  <ngx-mat-datetime-picker #datePicker [hideTime]="true"> </ngx-mat-datetime-picker>
</mat-form-field>
```

### With Validations

```typescript
// In the component
datetimeControl = new FormControl(null, [Validators.required]);

// Custom filter
dateFilter = (date: Date): boolean => {
  // Only weekdays
  const day = date.getDay();
  return day !== 0 && day !== 6; // No Sundays or Saturdays
};
```

```html
<mat-form-field>
  <mat-label>Business Date</mat-label>
  <input
    matInput
    [formControl]="datetimeControl"
    [ngxMatDatetimePicker]="picker"
    [dateFilter]="dateFilter" />
  <ngx-mat-datetime-picker #picker></ngx-mat-datetime-picker>
  <mat-error *ngIf="datetimeControl.hasError('required')"> Date is required </mat-error>
</mat-form-field>
```

### 12-Hour Format with Seconds

```html
<mat-form-field>
  <mat-label>Full Time</mat-label>
  <input matInput [ngxMatDatetimePicker]="timePicker" />
  <ngx-mat-datetime-picker
    #timePicker
    [showSeconds]="true"
    [enableMeridian]="true"
    [stepMinute]="5">
  </ngx-mat-datetime-picker>
</mat-form-field>
```

## Migration from V1

### Main Changes

| V1 (Previous)             | V2 (New)                  | Notes             |
| ------------------------- | ------------------------- | ----------------- |
| `ngx-mat-datetime-picker` | `ngx-mat-datetime-picker` | New selector      |
| `ngxMatDatetimePicker`    | `ngxMatDatetimePicker`    | New directive     |
| Custom implementation     | Native Angular Material   | Greater stability |

### Migration Steps

1. **Replace imports**:

   ```typescript
   // Before
   import { NgxMatDatetimePickerModule } from '@ngx-mce/datetime-picker';

   // After
   import { NgxMatDatetimePickerModule } from '@ngx-mce/datetime-picker';
   ```

2. **Update templates**:

   ```html
   <!-- Before -->
   <input [ngxMatDatetimePicker]="picker" />
   <ngx-mat-datetime-picker #picker></ngx-mat-datetime-picker>

   <!-- After -->
   <input [ngxMatDatetimePicker]="picker" />
   <ngx-mat-datetime-picker #picker></ngx-mat-datetime-picker>
   ```

3. **Check properties**: Most properties are compatible, but some may have changed names.

## API Reference

### NgxMatDatetimePicker

| Property         | Type                                | Default     | Description             |
| ---------------- | ----------------------------------- | ----------- | ----------------------- |
| `hideTime`       | `boolean`                           | `false`     | Hides the time selector |
| `showSpinners`   | `boolean`                           | `true`      | Shows increment buttons |
| `showSeconds`    | `boolean`                           | `false`     | Shows seconds selector  |
| `stepHour`       | `number`                            | `1`         | Hour increment          |
| `stepMinute`     | `number`                            | `1`         | Minute increment        |
| `stepSecond`     | `number`                            | `1`         | Second increment        |
| `enableMeridian` | `boolean`                           | `false`     | 12-hour format          |
| `color`          | `ThemePalette`                      | `'primary'` | Theme color             |
| `touchUi`        | `boolean`                           | `false`     | Touch device UI         |
| `disabled`       | `boolean`                           | `false`     | Disables the component  |
| `startView`      | `'month' \| 'year' \| 'multi-year'` | `'month'`   | Initial calendar view   |
| `defaultTime`    | `number[]`                          | `undefined` | Default time [h, m, s]  |

### Events

| Event          | Type                 | Description                    |
| -------------- | -------------------- | ------------------------------ |
| `openedStream` | `EventEmitter<void>` | Emitted when the picker opens  |
| `closedStream` | `EventEmitter<void>` | Emitted when the picker closes |

## Troubleshooting

### Error: "Cannot find module"

Make sure you have correctly imported the V2 module:

```typescript
import { NgxMatDatetimePickerModule } from '@ngx-mce/datetime-picker';
```

### Styles not applied

Check that you have imported the Angular Material theme:

```scss
@import '@angular/material/prebuilt-themes/indigo-pink.css';
```

### Timepicker not showing

Make sure `hideTime` is set to `false`:

```html
<ngx-mat-datetime-picker [hideTime]="false"></ngx-mat-datetime-picker>
```

## Support

This new V2 implementation is the recommended version for new projects. V1 will remain supported,
but migrating to V2 is recommended to take advantage of improvements and long-term stability.
