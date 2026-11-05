import { Overlay } from '@angular/cdk/overlay';
import { Component, provideZonelessChangeDetection, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { describe, expect, it, vi } from 'vitest';
import { NgxMatDatetimepicker } from './datepicker';
import { NgxMatDatepickerInput } from './datepicker-input';

@Component({
  selector: 'ngx-datepicker-test',
  imports: [NgxMatDatetimepicker, NgxMatDatepickerInput],
  template: `
    <input [ngxMatDatetimePicker]="picker">
    <ngx-mat-datetime-picker #picker [hideTime]="true" />
  `,
})
class DatepickerTestComponent {
  readonly picker = viewChild.required<NgxMatDatetimepicker<Date>>(NgxMatDatetimepicker);
}

describe('NgxMatDatetimepicker zoneless positioning', () => {
  it('updates the dropdown position after rendering', async () => {
    TestBed.configureTestingModule({
      imports: [DatepickerTestComponent],
      providers: [provideZonelessChangeDetection(), provideNativeDateAdapter()],
    });
    const fixture = TestBed.createComponent(DatepickerTestComponent);
    await fixture.whenStable();

    const createOverlay = vi.spyOn(TestBed.inject(Overlay), 'create');
    fixture.componentInstance.picker().open();
    const overlayRef = createOverlay.mock.results[0].value;
    const updatePosition = vi.spyOn(overlayRef, 'updatePosition');

    await fixture.whenStable();

    // CDK positions once; the picker must also reposition after its content has rendered.
    expect(updatePosition).toHaveBeenCalledTimes(2);
  });

  it('does not reposition a dropdown disposed before rendering', async () => {
    TestBed.configureTestingModule({
      imports: [DatepickerTestComponent],
      providers: [provideZonelessChangeDetection(), provideNativeDateAdapter()],
    });
    const fixture = TestBed.createComponent(DatepickerTestComponent);
    await fixture.whenStable();

    const createOverlay = vi.spyOn(TestBed.inject(Overlay), 'create');
    fixture.componentInstance.picker().open();
    const overlayRef = createOverlay.mock.results[0].value;
    const updatePosition = vi.spyOn(overlayRef, 'updatePosition');
    overlayRef.dispose();

    await fixture.whenStable();

    expect(updatePosition).not.toHaveBeenCalled();
  });
});
