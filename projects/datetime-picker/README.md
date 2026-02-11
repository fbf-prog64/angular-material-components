# Angular Material DatetimePicker and Timepicker
## For Angular Material 21.x

[![License](https://img.shields.io/npm/l/angular-material-components.svg)](https://www.npmjs.com/package/angular-material-components)
[![npm version](https://badge.fury.io/js/%40angular-material-components%2Fdatetime-picker.svg)](https://www.npmjs.com/package/@ngx-mce/datetime-picker)
[![Github All Releases](https://img.shields.io/npm/dt/@ngx-mce/datetime-picker.svg)]()

## Description

These are Date and Time pickers for Angular Material projects. Specifically, this extends the @angular/material
[Datepicker](https://material.angular.io/components/datepicker/overview) to support choosing time.

<a href="https://buymeacoffee.com/fbf.prog64" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

# Version control

Choose the version corresponding to your Angular version:

| Angular  | @ngx-mce/datetime-picker |
| -------- | -------------------------|
|    21    |           21.x           |
| 15 -- 20 | Please use [GNURub's version](https://github.com/GNURub/angular-material-components) |
|  7 -- 14 | Please use [h2qutc's version](https://github.com/h2qutc/angular-material-components) |

# Date and Time pickers in action

See demo:

* Over [StackBlitz](https://stackblitz.com/edit/demo-ngx-mat-datetime-picker).
* In the [documentation](https://fbf-prog64.github.io/angular-material-components/).

![DateTimePicker in action](demo_datetime_picker.png)

# How to use

## Install

```
npm install --save  @ngx-mce/datetime-picker
```

## Configure

Add the date provider of your choice to your app configuration, either in your application root or in your standalone component.

The following providers are available:

* `provideNativeDateAdapter`, based on native JS.
* `provideMomentDateAdapter`, based on Moment.js.
* `provideLuxonDateAdapter`, based on Luxon.
* `provideDateFnsAdapter`, based on date.fns.
* You may also provide a custom implementation.

This step is important to prevent the following error:

```
Error: NgxMatDatetimePicker: No provider found for DateAdapter.
```

```typescript
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    ...,
    provideNativeDateAdapter(),
    ...,
  ],
};
```

## Using the component

On your component, you can use the datepicker as follows:

```typescript
import {
  NgxMatDatepickerActions,
  NgxMatDatepickerApply,
  NgxMatDatepickerCancel,
  NgxMatDatepickerClear,
  NgxMatDatepickerInput,
  NgxMatDatetimepicker,
} from '@ngx-mce/datetime-picker';

@Component({
  selector: 'test',
  imports: [
    NgxMatDatepickerActions,
    NgxMatDatepickerActions,
    NgxMatDatepickerApply,
    NgxMatDatepickerCancel,
    NgxMatDatepickerClear,
    NgxMatDatepickerInput,
    NgxMatDatetimepicker,
    ..., // other imports
  ],
  template: `
    <input matInput [ngxMatDatetimePicker]="event" class="hidden" />

    <ngx-mat-datetime-picker #event>
      <ngx-mat-datepicker-actions>
        <div class="flex w-full justify-between">
          <button mat-button ngxMatDatepickerClear>Clear</button>
          <div>
            <button mat-button ngxMatDatepickerCancel>Cancel</button>
            <button mat-raised-button color="primary" ngxMatDatepickerApply>Apply</button>
          </div>
        </div>
      </ngx-mat-datepicker-actions>
    </ngx-mat-datetime-picker>
  `,
})
export class TestComponent {}
```

Check out the demo source code [here](src/app/demo-datetime/demo-datetime.module.ts).

### Markup

The template uses the same API as @angular/material Datepicker (see [API docs](https://material.angular.io/components/datepicker/api))

### Datetime Picker (ngx-mat-datetime-picker)

```html
<mat-form-field>
  <input
    matInput
    [ngxMatDatetimePicker]="picker"
    placeholder="Choose a date"
    [formControl]="dateControl"
    [min]="minDate"
    [max]="maxDate"
    [disabled]="disabled" />
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <ngx-mat-datetime-picker
    #picker
    [showSpinners]="showSpinners"
    [showSeconds]="showSeconds"
    [stepHour]="stepHour"
    [stepMinute]="stepMinute"
    [stepSecond]="stepSecond"
    [touchUi]="touchUi"
    [color]="color"
    [enableMeridian]="enableMeridian"
    [disableMinute]="disableMinute"
    [hideTime]="hideTime">
  </ngx-mat-datetime-picker>
</mat-form-field>
```

### Timepicker (ngx-mat-timepicker)

```
<ngx-mat-timepicker [(ngModel)]="date"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [disabled]="disabled"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [stepHour]="2" [stepMinute]="5" [stepSecond]="10"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [showSpinners]="showSpinners"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [showSeconds]="showSeconds"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [disableMinute]="disableMinute"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [defaultTime]="defaultTime"></ngx-mat-timepicker>
<ngx-mat-timepicker [formControl]="formControl"></ngx-mat-timepicker>
```

## List of @Input of ngx-mat-timepicker

_These properties are also available in ngx-mat-datetime-picker._

| @Input             | Type         | Default value | Description                                                                                                                                                                  |
| ------------------ | ------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **disabled**       | boolean      | null          | If true, the picker is readonly and can't be modified                                                                                                                        |
| **showSpinners**   | boolean      | true          | If true, the spinners above and below input are visible                                                                                                                      |
| **showSeconds**    | boolean      | true          | If true, it is not possible to select seconds                                                                                                                                |
| **disableMinute**  | boolean      | false         | If true, the minute (and second) is readonly                                                                                                                                 |
| **defaultTime**    | Array        | undefined     | An array [hour, minute, second] for default time when the date is not yet defined                                                                                            |
| **stepHour**       | number       | 1             | The number of hours to add/substract when clicking hour spinners                                                                                                             |
| **stepMinute**     | number       | 1             | The number of minutes to add/substract when clicking minute spinners                                                                                                         |
| **stepSecond**     | number       | 1             | The number of seconds to add/substract when clicking second spinners                                                                                                         |
| **color**          | ThemePalette | undefined     | Color palette to use on the datepicker's calendar.                                                                                                                           |
| **enableMeridian** | boolean      | false         | Whether to display 12H or 24H mode.                                                                                                                                          |
| **hideTime**       | boolean      | false         | If true, the time is hidden.                                                                                                                                                 |
| **touchUi**        | boolean      | false         | Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather than a popup and elements have more padding to allow for bigger touch targets. |

## Choosing the best date provider and format settings

* [NativeDateAdapter](https://github.com/angular/components/blob/main/src/material/core/datetime/index.ts)
* [DateFnsAdapter](https://github.com/angular/components/blob/main/src/material-date-fns-adapter/adapter/index.ts)
* [LuxonDateAdapter](https://github.com/angular/components/blob/main/src/material-luxon-adapter/adapter/index.ts)
* [MomentDateAdapter](https://github.com/angular/components/blob/main/src/material-moment-adapter/adapter/index.ts)

Examples of using a custom adapter are provided below.

```
@Injectable()
export class CustomDateAdapter extends DateAdapter<D> {...}
// D can be Date, Moment or customized type
```

```
// If using Moment
const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: "l, LTS"
  },
  display: {
    dateInput: "l, LTS",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
```

Providing the custom adapter in the Module.

```
export function provideNgxMatCustomDate() {
  return makeEnvironmentProviders([
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ]);
}

```

You can also customize the date format by providing your custom `MAT_DATE_FORMATS` in your module.

## Theming

- @see @angular/material
  [Using a pre-built theme](https://material.angular.io/guide/theming#using-a-pre-built-theme)
- Add the Material Design icon font to your index.html

```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">
```

## License

MIT
