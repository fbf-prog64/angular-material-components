import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'datetimepicker',
    loadComponent: () =>
      import('./demo-datetime/demo-datetime.component').then((m) => m.DemoDatetimeComponent),
  },
  {
    path: 'datetimepicker-v2',
    loadComponent: () =>
      import('./demo-datetime-v2/demo-datetime-v2.component').then((m) => m.DemoDatetimeV2Component),
  },
  {
    path: 'timepicker',
    loadComponent: () => import('./demo-time/demo-time.component').then((m) => m.DemoTimeComponent),
  },
  {
    path: 'colorpicker',
    loadComponent: () =>
      import('./demo-colorpicker/demo-colorpicker.component').then(
        (m) => m.DemoColorpickerComponent,
      ),
  },
  {
    path: 'fileinput',
    loadComponent: () =>
      import('./demo-fileinput/demo-fileinput.component').then((m) => m.DemoFileInputComponent),
  },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
