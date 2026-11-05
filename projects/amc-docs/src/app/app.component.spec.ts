import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenav } from '@angular/material/sidenav';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent zoneless responsive layout', () => {
  let fixture: ComponentFixture<AppComponent>;
  let breakpointChanges: BehaviorSubject<BreakpointState>;

  function setHandset(matches: boolean) {
    breakpointChanges.next({
      matches,
      breakpoints: { [Breakpoints.XSmall]: matches },
    });
  }

  function sidenav(): MatSidenav {
    return fixture.debugElement.query(By.directive(MatSidenav)).componentInstance;
  }

  function githubLink(): HTMLAnchorElement | null {
    return fixture.nativeElement.querySelector('a.img-btn');
  }

  beforeEach(async () => {
    breakpointChanges = new BehaviorSubject<BreakpointState>({
      matches: false,
      breakpoints: { [Breakpoints.XSmall]: false },
    });
    const observe = vi.fn().mockReturnValue(breakpointChanges.asObservable());
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: BreakpointObserver, useValue: { observe } },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    expect(observe).toHaveBeenCalledWith([Breakpoints.XSmall]);
  });

  it('initially renders the desktop layout', () => {
    expect(sidenav().mode).toBe('side');
    expect(sidenav().opened).toBe(true);
    expect(sidenav().disableClose).toBe(true);
    expect(githubLink()).not.toBeNull();
  });

  it('renders handset and desktop transitions without manual change detection', async () => {
    setHandset(true);
    await fixture.whenStable();

    expect(sidenav().mode).toBe('over');
    expect(sidenav().opened).toBe(false);
    expect(sidenav().disableClose).toBe(false);
    expect(githubLink()).toBeNull();
    expect(fixture.componentInstance.sidenavHasBackdrop).toBe(true);

    setHandset(false);
    await fixture.whenStable();

    expect(sidenav().mode).toBe('side');
    expect(sidenav().opened).toBe(true);
    expect(sidenav().disableClose).toBe(true);
    expect(githubLink()).not.toBeNull();
    expect(fixture.componentInstance.sidenavHasBackdrop).toBe(false);
  });

  it('unsubscribes from breakpoint changes when destroyed', () => {
    expect(breakpointChanges.observed).toBe(true);
    fixture.destroy();

    expect(breakpointChanges.observed).toBe(false);
    setHandset(true);
    expect(fixture.componentInstance.isHandset).toBe(false);
  });
});
