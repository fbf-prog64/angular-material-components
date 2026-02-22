import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    RouterModule,
  ],
})
export class AppComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  public nameApp = 'angular-material-components';

  isHandset: boolean;
  sidenavMode: 'side' | 'over' | 'push';
  sidenavHasBackdrop: boolean;
  sidenavOpened: boolean;

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(takeUntilDestroyed())
      .subscribe((resp) => {
        this.isHandset = resp?.matches;
        if (this.isHandset) {
          this.activateHandsetLayout();
        } else {
          this.activateWebLayout();
        }
      });
  }

  protected activateHandsetLayout() {
    this.sidenavMode = 'over';
    this.sidenavHasBackdrop = true;
    this.sidenavOpened = false;
  }

  protected activateWebLayout() {
    this.sidenavMode = 'side';
    this.sidenavHasBackdrop = false;
    this.sidenavOpened = true;
  }
}
