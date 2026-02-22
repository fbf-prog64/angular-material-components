import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, ThemePalette } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs/operators';
import {
  createMissingDateImplError,
  DEFAULT_STEP,
  formatTwoDigitTimeValue,
  LIMIT_TIMES,
  NUMERIC_REGEX,
  PATTERN_INPUT_HOUR,
  PATTERN_INPUT_MINUTE,
  PATTERN_INPUT_SECOND,
} from './utils/date-utils';

export enum MERIDIANS {
  AM = 'AM',
  PM = 'PM',
}

@Component({
  selector: 'ngx-mat-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.scss',
  host: {
    class: 'ngx-mat-timepicker',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxMatTimepickerComponent),
      multi: true,
    },
  ],
  exportAs: 'ngxMatTimepicker',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class NgxMatTimepickerComponent<D> implements ControlValueAccessor {
  private readonly formBuilder = inject(FormBuilder);
  private readonly _dateAdapter = inject(DateAdapter<D>, { optional: true });

  readonly disabled = input<boolean>(false);
  readonly showSpinners = input<boolean>(true);
  readonly stepHour = input<number>(DEFAULT_STEP);
  readonly stepMinute = input<number>(DEFAULT_STEP);
  readonly stepSecond = input<number>(DEFAULT_STEP);
  readonly showSeconds = input<boolean>(false);
  readonly disableMinute = input<boolean>(false);
  readonly enableMeridian = input<boolean>(false);
  readonly defaultTime = input<[number, number, number]>();
  readonly color = input<ThemePalette>('primary');

  public readonly pattern = PATTERN_INPUT_HOUR;

  public readonly meridianInput = input<MERIDIANS>(MERIDIANS.AM, {
    alias: 'meridian',
  });
  public readonly meridian = linkedSignal(() => this.meridianInput());

  public readonly form = this.formBuilder.group({
    hour: new FormControl(this.defaultTime()?.[0] ? String(this.defaultTime()[0]) : null, {
      validators: [Validators.required, Validators.pattern(PATTERN_INPUT_HOUR)],
      nonNullable: true,
    }),
    minute: new FormControl(this.defaultTime()?.[1] ? String(this.defaultTime()[1]) : null, {
      validators: [Validators.required, Validators.pattern(PATTERN_INPUT_MINUTE)],
      nonNullable: true,
    }),
    second: new FormControl(this.defaultTime()?.[2] ? String(this.defaultTime()[2]) : null, {
      validators: [Validators.required, Validators.pattern(PATTERN_INPUT_SECOND)],
      nonNullable: true,
    }),
  });

  private _onChange: any = () => {};
  private _onTouched: any = () => {};
  public readonly value = model<D>();

  /** Hour */
  private get hour(): number {
    const val = Number(this.form.controls['hour'].getRawValue());
    return Number.isNaN(val) ? 0 : val;
  }

  private get minute(): number {
    const val = Number(this.form.controls['minute'].getRawValue());
    return Number.isNaN(val) ? 0 : val;
  }

  private get second(): number {
    const val = Number(this.form.controls['second'].getRawValue());
    return Number.isNaN(val) ? 0 : val;
  }

  constructor() {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }

    this.form.valueChanges.pipe(takeUntilDestroyed(), debounceTime(300)).subscribe(() => {
      this._updateModel();
    });

    effect(() => {
      this._setDisableStates(this.disabled(), this.disableMinute());
    });

    effect(() => {
      const val = this.value();
      if (val) {
        this._updateHourMinuteSecond(val);
      }
    });

    effect(() => {
      this.meridian();
      untracked(() => this.change('hour'));
    });
  }

  writeValue(val: D): void {
    if (val != null) {
      this.value.set(val);
    }
  }

  registerOnChange(fn: (_: any) => {}): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this._setDisableStates(false, this.disableMinute());
    }
  }

  public formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(NUMERIC_REGEX, '');
  }

  public toggleMeridian() {
    this.meridian.set(this.meridian() === MERIDIANS.AM ? MERIDIANS.PM : MERIDIANS.AM);
  }

  public change(prop: 'hour' | 'minute' | 'second', up?: boolean) {
    const next = this._getNextValueByProp(prop, up);
    this.form.controls[prop].setValue(formatTwoDigitTimeValue(next), {
      onlySelf: false,
      emitEvent: true,
    });
    this._onTouched();
  }

  private _updateHourMinuteSecond(val: D) {
    let _hour = this._dateAdapter.getHours(val);
    const _minute = this._dateAdapter.getMinutes(val);
    const _second = this._dateAdapter.getSeconds(val);

    if (this.enableMeridian()) {
      if (_hour >= LIMIT_TIMES.meridian) {
        _hour = _hour - LIMIT_TIMES.meridian;
        this.meridian.set(MERIDIANS.PM);
      } else {
        this.meridian.set(MERIDIANS.AM);
      }
      if (_hour === 0) {
        _hour = LIMIT_TIMES.meridian;
      }
    }

    this.form.patchValue(
      {
        hour: formatTwoDigitTimeValue(_hour),
        minute: formatTwoDigitTimeValue(_minute),
        second: formatTwoDigitTimeValue(_second),
      },
      { emitEvent: false },
    );
  }

  /** Update model */
  private _updateModel() {
    if (this.form.invalid) {
      return;
    }

    let _hour = this.hour;

    if (this.enableMeridian()) {
      if (this.meridian() === MERIDIANS.AM && _hour === LIMIT_TIMES.meridian) {
        _hour = 0;
      } else if (this.meridian() === MERIDIANS.PM && _hour !== LIMIT_TIMES.meridian) {
        _hour = _hour + LIMIT_TIMES.meridian;
      }
    }

    const val = this.value();
    if (val) {
      let clonedModel = this._dateAdapter.clone(val);
      clonedModel = this._dateAdapter.setTime(clonedModel, _hour, this.minute, this.second);

      this.value.set(clonedModel);
      this._onChange(clonedModel);
      this._onTouched();
    }
  }

  /**
   * Get next value by property
   */
  private _getNextValueByProp(prop: string, up?: boolean): number {
    const keyProp = prop[0].toUpperCase() + prop.slice(1);
    const min = LIMIT_TIMES[`min${keyProp}`];
    let max = LIMIT_TIMES[`max${keyProp}`];

    if (prop === 'hour' && this.enableMeridian()) {
      max = LIMIT_TIMES.meridian;
    }

    let next;
    if (up == null) {
      next = this[prop] % max;
      if (prop === 'hour' && this.enableMeridian()) {
        if (next === 0) next = max;
      }
    } else {
      const step = this[`step${keyProp}`]();
      next = up ? this[prop] + step : this[prop] - step;

      if (prop === 'hour' && this.enableMeridian()) {
        next = next % (max + 1);
        if (next === 0) next = up ? 1 : max;
      } else {
        next = next % max;
      }

      if (up) {
        next = next > max ? next - max + min : next;
      } else {
        next = next < min ? next - min + max : next;
      }
    }

    return next;
  }

  /**
   * Set disable states
   */
  private _setDisableStates(disabled: boolean, disableMinute: boolean) {
    if (disabled) {
      this.form.disable();
    } else {
      this.form.enable();
      if (disableMinute) {
        this.form.get('minute').disable();
        if (this.showSeconds()) {
          this.form.get('second').disable();
        }
      }
    }
  }
}
