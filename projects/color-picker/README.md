# Angular Material Color Picker
## For Angular Material 21.x

[![License](https://img.shields.io/npm/l/angular-material-components.svg)](https://www.npmjs.com/package/@ngx-mce/angular-material-components)
[![npm version](https://badge.fury.io/js/%40angular-material-components%2Fcolor-picker.svg)](https://www.npmjs.com/package/@ngx-mce/color-picker)

## Description

This is a Color Picker for Angular Material projects.

<a href="https://buymeacoffee.com/fbf.prog64" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

# Version control

Choose the version corresponding to your Angular version:

| Angular  | @ngx-mce/datetime-picker |
| -------- | -------------------------|
|    21    |           21.x           |
| 15 -- 20 | Please use [GNURub's version](https://github.com/GNURub/angular-material-components) |
|  7 -- 14 | Please use [h2qutc's version](https://github.com/h2qutc/angular-material-components) |

# Color Picker in action

See demo [here](https://stackblitz.com/edit/demo-ngx-mat-color-picker).

![Color Picker in action](demo_color_picker.png)

# How to use

## Install

```
npm install --save  @ngx-mce/color-picker
```

## Configure

```
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@ngx-mce/color-picker';

@NgModule({
   ...
   imports: [
        ...
        NgxMatColorPickerModule
   ],
   providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
   ],
   ...
})
export class AppModule { }
```

Check more details [here](src/app/demo-colorpicker/demo-colorpicker.module.ts).

## Using the component

```
<mat-form-field>
    <input matInput [ngxMatColorPicker]="picker" [formControl]="colorCtr" [disabled]="disabled">
    <ngx-mat-color-toggle matSuffix [for]="picker"></ngx-mat-color-toggle>
    <ngx-mat-color-picker #picker [touchUi]="touchUi" [color]="color"></ngx-mat-color-picker>
</mat-form-field>
```

### List of @Input

| @Input       | Type    | Default value | Description                                                                                                                                                                  |
| ------------ | ------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **disabled** | boolean | null          | If true, the picker is readonly and can't be modified                                                                                                                        |
| **touchUi**  | boolean | false         | Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather than a popup and elements have more padding to allow for bigger touch targets. |

## Theming

- @see @angular/material
  [Using a pre-built theme](https://material.angular.io/guide/theming#using-a-pre-built-theme)
- Add the Material Design icon font to your index.html

```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">
```

## License

MIT
