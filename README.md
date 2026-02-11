# Angular Material Extra Components
## Includes DatetimePicker, TimePicker, ColorPicker, FileInput...
### For Angular Material 21.x

Forked from [**GNURub/angular-material-components**](https://github.com/GNURub/angular-material-components).

[![License](https://img.shields.io/npm/l/angular-material-components.svg)](https://www.npmjs.com/package/@ngx-mce/angular-material-components)

## 🚀 Live Demo

See live demo and documentation [**here**](https://fbf-prog64.github.io/angular-material-components/).

## Description

This repository provides extra components for Angular Material projects: Datetime picker, Time picker, Color picker, etc.  

Please contact us if you have any question or suggestion. Also feel free to open an issue [here](https://github.com/fbf-prog64/angular-material-components/issues), or contribute via a PR.

If you like this project, support it by starring it ⭐.

You can also donate if you have the means. Thank you very much! 💖

<a href="https://buymeacoffee.com/fbf.prog64" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Version control

Choose the version corresponding to your Angular version:

| Angular  | @ngx-mce/datetime-picker |
| -------- | -------------------------|
|    21    |           21.x           |
| 15 -- 20 | Please use [GNURub's version](https://github.com/GNURub/angular-material-components) |
|  7 -- 14 | Please use [h2qutc's version](https://github.com/h2qutc/angular-material-components) |

## Available components

These are the components included with this project.

### Datetime Picker

You can details about this component [**here**](https://fbf-prog64.github.io/angular-material-components/)

[![npm version](https://badge.fury.io/js/%40angular-material-components%2Fdatetime-picker.svg)](https://www.npmjs.com/package/@ngx-mce/datetime-picker)
[![Github All Releases](https://img.shields.io/npm/dt/@ngx-mce/datetime-picker.svg)]()

#### How to install

```
npm install --save  @ngx-mce/datetime-picker
```

![Datetime picker in action](demo_datetime_picker.png)

Online demos for old versions:

* [Angular 7 and 8](https://stackblitz.com/edit/demo-ngx-mat-datetime-picker)
* [Angular 9](https://stackblitz.com/edit/demo-ngx-mat-datetime-picker-angular9)

### Color Picker

You can see details about this component [**here**](https://fbf-prog64.github.io/angular-material-components/)

[![npm version](https://badge.fury.io/js/%40angular-material-components%2Fcolor-picker.svg)](https://www.npmjs.com/package/@ngx-mce/color-picker)
[![Github All Releases](https://img.shields.io/npm/dt/@ngx-mce/color-picker.svg)]()

#### How to install

```
npm install --save  @ngx-mce/color-picker
```

![Color picker in action](demo_color_picker.png)

Online demo: [here](https://stackblitz.com/edit/demo-ngx-mat-color-picker).

### File Input

You can see details about this component [**here**](https://fbf-prog64.github.io/angular-material-components/)

[![npm version](https://badge.fury.io/js/%40angular-material-components%2Ffile-input.svg)](https://www.npmjs.com/package/@ngx-mce/file-input)
[![Github All Releases](https://img.shields.io/npm/dt/@ngx-mce/file-input.svg)]()

#### How to install

```
npm install --save  @ngx-mce/file-input
```

![File Input in action](demo_file_input.png)

### Theming

- Check out @angular/material
  [Using a pre-built theme](https://material.angular.io/guide/theming#using-a-pre-built-theme)
- Add the Material Design icon font to your index.html:

  ```
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">
  ```

## 🚀 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. You can also deploy
manually:

### Automatic Deployment

- Pushes to the `main` branch automatically trigger deployment.
- GitHub Actions workflow builds and deploys to `gh-pages` branch.
- Site is available at: [https://fbf-prog64.github.io/angular-material-components/](https://fbf-prog64.github.io/angular-material-components/)

### Manual Deployment

```bash
# Build for GitHub Pages
pnpm run build:gh-pages

# Deploy to GitHub Pages
pnpm run deploy:gh-pages
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

MIT
