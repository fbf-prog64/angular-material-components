import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NgxMatCalendarBody, NgxMatCalendarCell } from './calendar-body';

describe('NgxMatCalendarBody zoneless focus', () => {
  let fixture: ComponentFixture<NgxMatCalendarBody>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NgxMatCalendarBody],
      providers: [provideZonelessChangeDetection()],
    });

    fixture = TestBed.createComponent(NgxMatCalendarBody);
    fixture.componentRef.setInput('rows', [[
      new NgxMatCalendarCell(1, '1', 'First day', true),
      new NgxMatCalendarCell(2, '2', 'Second day', true),
    ]]);
    fixture.componentRef.setInput('numCols', 2);
    await fixture.whenStable();
  });

  it('focuses the newly active cell after rendering', async () => {
    fixture.componentRef.setInput('activeCell', 1);
    fixture.componentInstance._focusActiveCell();

    await fixture.whenStable();

    await vi.waitFor(() => {
      expect(document.activeElement?.textContent?.trim()).toBe('2');
      expect(document.activeElement?.classList.contains('mat-calendar-body-active')).toBe(true);
    });
  });

  it('focuses the active cell scheduled during view checking', async () => {
    fixture.componentRef.setInput('activeCell', 1);
    fixture.componentInstance._scheduleFocusActiveCellAfterViewChecked();

    await fixture.whenStable();

    await vi.waitFor(() => {
      expect(document.activeElement?.textContent?.trim()).toBe('2');
    });
  });

  it('preserves the range preview when moving focus without moving the preview', async () => {
    fixture.componentRef.setInput('isRange', true);
    const previewChange = vi.fn();
    fixture.componentInstance.previewChange.subscribe(previewChange);
    fixture.componentInstance._focusActiveCell(false);

    await fixture.whenStable();

    await vi.waitFor(() => {
      expect(document.activeElement?.textContent?.trim()).toBe('1');
    });
    expect(previewChange).not.toHaveBeenCalled();
  });

  it('updates the range preview when moving focus normally', async () => {
    fixture.componentRef.setInput('isRange', true);
    const previewChange = vi.fn();
    fixture.componentInstance.previewChange.subscribe(previewChange);
    fixture.componentInstance._focusActiveCell();

    await fixture.whenStable();

    await vi.waitFor(() => {
      expect(previewChange).toHaveBeenCalledWith(expect.objectContaining({
        value: expect.objectContaining({ value: 1 }),
      }));
    });
  });

  it('cancels the pending render callback when destroyed', async () => {
    const host: HTMLElement = fixture.nativeElement;
    const querySelector = vi.spyOn(host, 'querySelector');
    fixture.componentInstance._focusActiveCell();
    fixture.destroy();

    await TestBed.inject(ApplicationRef).whenStable();

    expect(querySelector).not.toHaveBeenCalledWith('.mat-calendar-body-active');
  });
});
