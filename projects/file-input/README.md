# Angular Material File Input
## For Angular Material 21.x

[![License](https://img.shields.io/npm/l/angular-material-components.svg)](https://www.npmjs.com/package/@ngx-mce/file-input)
[![npm version](https://badge.fury.io/js/%40angular-material-components%2Ffile-input.svg)](https://www.npmjs.com/package/@ngx-mce/file-input)
[![Github All Releases](https://img.shields.io/npm/dt/@ngx-mce/file-input.svg)]()

## Description

This is a File Input component for Angular Material projects.

<a href="https://buymeacoffee.com/fbf.prog64" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

# Version control

Choose the version corresponding to your Angular version:

| Angular  | @ngx-mce/datetime-picker |
| -------- | -------------------------|
|    21    |           21.x           |
| 15 -- 20 | Please use [GNURub's version](https://github.com/GNURub/angular-material-components) |
|  7 -- 14 | Please use [h2qutc's version](https://github.com/h2qutc/angular-material-components) |

# File Input in action

See demo:

* Over [StackBlitz](https://stackblitz.com/edit/demo-ngx-mat-file-input).
* In the [documentation](https://fbf-prog64.github.io/angular-material-components/).

![File Input in action](demo_file_input.png)

# How to use

## Install

```
npm install --save @ngx-mce/file-input
```

## Configure

```
import { NgxMatFileInputModule } from '@ngx-mce/file-input';

@NgModule({
   ...
   imports: [
        ...
        NgxMatFileInputModule
   ]
   ...
})
export class AppModule { }
```

Check more details [here](src/app/demo-fileinput/demo-fileinput.module.ts).

## Using the component

```
<mat-form-field>
   <ngx-mat-file-input [formControl]="fileControl" [multiple]="multiple" [accept]="accept" [color]="color">
   </ngx-mat-file-input>
</mat-form-field>
```

ℹ️ You can provide a custom icon by using the directive **_ngxMatFileInputIcon_**.

```
<mat-form-field>
   <ngx-mat-file-input [formControl]="fileControl" [multiple]="multiple" [accept]="accept"
   [color]="color">
      <mat-icon ngxMatFileInputIcon>folder</mat-icon>
   </ngx-mat-file-input>
</mat-form-field>
```

ℹ️ This compoment accepts all properties of a regular **MatFormField**, such as appearance variants, hints...

```
<mat-form-field appearance="outline">
  <ngx-mat-file-input [formControl]="file3Control">
  </ngx-mat-file-input>
  <mat-hint>Hint</mat-hint>
</mat-form-field>
```

### List of @Input

| @Input       | Type         | Default value | Description                                                                                                                          |
| ------------ | ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **disabled** | boolean      | null          | If true, the file input is readonly.                                                                                                 |
| **multiple** | boolean      | false         | If true, the file input allows the user to select more than one file.                                                                |
| **accept**   | string       | null          | Limiting accepted file types (For example: accept="image/png, image/jpeg" or accept=".png, .jpg, .jpeg" — Accept PNG or JPEG files.) |
| **color**    | ThemePalette | null          | Theme color palette for the component.                                                                                               |

## Theming

- @see @angular/material
  [Using a pre-built theme](https://material.angular.io/guide/theming#using-a-pre-built-theme)
- Add the Material Design icon font to your index.html

```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">
```

## License

MIT
