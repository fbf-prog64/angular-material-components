import { Overlay } from '@angular/cdk/overlay';
import { Component, provideZonelessChangeDetection, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { MAT_COLOR_FORMATS, NGX_MAT_COLOR_FORMATS } from '../../services';
import { NgxMatColorPickerInput } from './color-input.component';
import {
  NgxMatColorPickerComponent,
  NgxMatColorPickerContentComponent,
} from './color-picker.component';

@Component({
  selector: 'ngx-color-picker-test',
  imports: [NgxMatColorPickerComponent, NgxMatColorPickerInput],
  template: `
    <input [ngxMatColorPicker]="picker">
    <ngx-mat-color-picker #picker />
  `,
})
class ColorPickerTestComponent {
  readonly picker = viewChild.required(NgxMatColorPickerComponent);
}

describe('NgxMatColorPickerComponent zoneless positioning', () => {
  async function createFixture() {
    TestBed.configureTestingModule({
      imports: [ColorPickerTestComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
      ],
    });
    TestBed.overrideComponent(NgxMatColorPickerContentComponent, {
      set: { template: '', imports: [] },
    });
    const fixture = TestBed.createComponent(ColorPickerTestComponent);
    await fixture.whenStable();
    return fixture;
  }

  it('updates the popup position after rendering', async () => {
    const fixture = await createFixture();
    const createOverlay = vi.spyOn(TestBed.inject(Overlay), 'create');
    fixture.componentInstance.picker().open();
    const overlayRef = createOverlay.mock.results[0].value;
    const updatePosition = vi.spyOn(overlayRef, 'updatePosition');

    await fixture.whenStable();

    // CDK positions once; the picker must also reposition after its content has rendered.
    expect(updatePosition).toHaveBeenCalledTimes(2);
  });

  it('does not reposition a popup detached before rendering', async () => {
    const fixture = await createFixture();
    const createOverlay = vi.spyOn(TestBed.inject(Overlay), 'create');
    fixture.componentInstance.picker().open();
    const overlayRef = createOverlay.mock.results[0].value;
    const updatePosition = vi.spyOn(overlayRef, 'updatePosition');
    overlayRef.detach();

    await fixture.whenStable();

    expect(updatePosition).not.toHaveBeenCalled();
  });
});
