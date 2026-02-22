import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DateAdapter, ThemePalette } from '@angular/material/core';
import { MatCalendarView } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { NGX_MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER } from './date-selection-model';
import { NgxMatDatepickerControl } from './datepicker-base';
import { createMissingDateImplError } from './datepicker-errors';
import { NgxMatDatetimePickerContentV2 } from './datetime-picker-content-v2.component';
import { NgxMatDatetimePickerInputV2 } from './datetime-picker-input-v2.directive';
import { DEFAULT_STEP } from './utils/date-utils';

let datepickerUid = 0;

@Component({
  selector: 'ngx-mat-datetime-picker',
  template: '',
  exportAs: 'ngxMatDatetimePicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [NGX_MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER],
})
export class NgxMatDatetimePickerV2<D> implements OnDestroy {
  private readonly _dialog = inject(MatDialog);
  private readonly _dateAdapter = inject(DateAdapter<D>, { optional: true });

  private _dialogRef: MatDialogRef<NgxMatDatetimePickerContentV2<D>> | null = null;
  private _inputStateChanges = Subscription.EMPTY;

  /** The id for the datepicker. */
  readonly id = `ngx-mat-datetime-picker-${datepickerUid++}`;

  /** The input element this datepicker is associated with. */
  datepickerInput: NgxMatDatepickerControl<D>;

  /** Emits when the datepicker is disabled. */
  readonly stateChanges = new Subject<void>();

  /** Emits when the datepicker has been opened. */
  @Output() readonly openedStream = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  @Output() readonly closedStream = new EventEmitter<void>();

  // Configuration inputs
  readonly startView = input<MatCalendarView>('month');
  readonly color = input<ThemePalette>('primary');
  readonly touchUi = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly hideTime = input<boolean>(false);
  readonly showSpinners = input<boolean>(true);
  readonly showSeconds = input<boolean>(false);
  readonly stepHour = input<number>(DEFAULT_STEP);
  readonly stepMinute = input<number>(DEFAULT_STEP);
  readonly stepSecond = input<number>(DEFAULT_STEP);
  readonly enableMeridian = input<boolean>(false);
  readonly disableMinute = input<boolean>(false);
  readonly defaultTime = input<number[]>();
  readonly startAt = input<D | null>(null);
  readonly panelClass = input<string | string[]>([]);

  // Internal state
  private readonly _opened = signal(false);
  readonly opened = this._opened.asReadonly();

  constructor() {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
  }

  ngOnDestroy(): void {
    this._inputStateChanges.unsubscribe();
    this.stateChanges.complete();
    this.close();
  }

  /** Register an input with this datepicker. */
  _registerInput(input: NgxMatDatepickerControl<D>): void {
    console.log('🔗 Registering input with datepicker:', input.constructor.name);

    if (this.datepickerInput) {
      throw Error('A MatDatepicker can only be associated with a single input.');
    }

    this.datepickerInput = input;
    this._inputStateChanges = input.stateChanges.subscribe(() => this.stateChanges.next());

    console.log('✅ Input successfully registered');
  }

  /** Open the calendar. */
  open(): void {
    if (this._opened() || this.disabled()) {
      return;
    }

    if (!this.datepickerInput) {
      throw Error('Attempted to open an MatDatepicker with no associated input.');
    }

    this._opened.set(true);
    this._openAsDialog();
    this.openedStream.emit();
  }

  /** Close the calendar. */
  close(): void {
    if (!this._opened()) {
      return;
    }

    if (this._dialogRef) {
      this._dialogRef.close();
      this._dialogRef = null;
    }

    this._opened.set(false);
    this.closedStream.emit();
  }

  /** Applies the current pending selection on the overlay to the model. */
  select(date: D): void {
    // This will be handled by the content component
  }

  /** Get the minimum date from the input. */
  _getMinDate(): D | null {
    return this.datepickerInput?.min || null;
  }

  /** Get the maximum date from the input. */
  _getMaxDate(): D | null {
    return this.datepickerInput?.max || null;
  }

  /** Get the date filter from the input. */
  _getDateFilter(): ((date: D) => boolean) | null {
    return this.datepickerInput?.dateFilter || null;
  }

  /** Open the calendar as a dialog. */
  private _openAsDialog(): void {
    console.debug('🚀 Opening datetime picker dialog');

    const panelClasses = ['ngx-mat-datepicker-dialog'];
    const customPanelClass = this.panelClass();

    if (customPanelClass) {
      if (Array.isArray(customPanelClass)) {
        panelClasses.push(...customPanelClass.filter((cls) => cls));
      } else {
        panelClasses.push(customPanelClass);
      }
    }

    const initialValue = this.datepickerInput?.getStartValue();
    console.debug('📅 Initial value for dialog:', initialValue);

    this._dialogRef = this._dialog.open(NgxMatDatetimePickerContentV2<D>, {
      panelClass: panelClasses,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      disableClose: false,
      width: this.touchUi() ? '320px' : '328px',
      data: {
        datepicker: this,
        color: this.color(),
        touchUi: this.touchUi(),
        hideTime: this.hideTime(),
        showSpinners: this.showSpinners(),
        showSeconds: this.showSeconds(),
        stepHour: this.stepHour(),
        stepMinute: this.stepMinute(),
        stepSecond: this.stepSecond(),
        enableMeridian: this.enableMeridian(),
        defaultTime: this.defaultTime(),
        disabled: this.disabled(),
        startView: this.startView(),
        minDate: this._getMinDate(),
        maxDate: this._getMaxDate(),
        dateFilter: this._getDateFilter(),
        value: initialValue,
      },
    });

    this._dialogRef.afterClosed().subscribe((result: D | undefined) => {
      console.debug('🔚 Dialog closed with result:', result);
      if (result !== undefined && this.datepickerInput) {
        console.debug('📝 Attempting to update input value with:', result);
        console.debug('📝 Input instance:', this.datepickerInput.constructor.name);

        // Use the public method to properly update the input
        if (this.datepickerInput instanceof NgxMatDatetimePickerInputV2) {
          console.debug('✅ Calling updateValue on NgxMatDatetimePickerInputV2');
          this.datepickerInput.updateValue(result);
        } else {
          console.debug('❌ Input is not instance of NgxMatDatetimePickerInputV2');
        }
      } else {
        console.debug('❌ No result or no input available');
      }
      this.close();
    });
  }
}
