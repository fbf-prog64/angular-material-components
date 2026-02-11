import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, ThemePalette } from '@angular/material/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Subject, Subscription } from 'rxjs';
import { NgxMatDatepickerControl } from './datepicker-base';
import { createMissingDateImplError } from './datepicker-errors';
import { NgxMatDatetimePickerV2 } from './datetime-picker-v2.component';

export const NGX_MAT_DATETIME_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgxMatDatetimePickerInputV2),
  multi: true,
};

export const NGX_MAT_DATETIME_PICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgxMatDatetimePickerInputV2),
  multi: true,
};

@Directive({
  selector: 'input[ngxMatDatetimePicker]',
  providers: [
    NGX_MAT_DATETIME_PICKER_VALUE_ACCESSOR,
    NGX_MAT_DATETIME_PICKER_VALIDATORS,
    { provide: MatFormFieldControl, useExisting: NgxMatDatetimePickerInputV2 },
  ],
  host: {
    class: 'ngx-mat-datetime-picker-input',
    '[attr.aria-haspopup]': 'ngxMatDatetimePicker ? "dialog" : null',
    '[attr.aria-owns]': '(ngxMatDatetimePicker?.opened && ngxMatDatetimePicker.id) || null',
    '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
    '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
    '[attr.data-mat-calendar]': 'ngxMatDatetimePicker ? ngxMatDatetimePicker.id : null',
    '[disabled]': 'disabled',
    '(input)': '_onInput($event.target.value)',
    '(change)': '_onChange()',
    '(blur)': '_onBlur()',
    '(keydown)': '_onKeydown($event)',
    '(click)': '_onClick($event)',
  },
})
export class NgxMatDatetimePickerInputV2<D>
  implements
    MatFormFieldControl<D>,
    ControlValueAccessor,
    OnDestroy,
    OnInit,
    Validator,
    NgxMatDatepickerControl<D>
{
  readonly _dateAdapter = inject(DateAdapter<D>, { optional: true });

  private readonly _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly _dateFormats = inject(MAT_DATE_FORMATS, { optional: true });
  private readonly _formField = inject(MatFormField, { optional: true });

  // Reference to NgControl - will be set manually to avoid circular dependency
  public ngControl: NgControl | null = null;

  @Input() ngxMatDatetimePicker: NgxMatDatetimePickerV2<D>;

  /** The value of the input. */
  @Input()
  get value(): D | null {
    return this._value();
  }
  set value(value: D | null) {
    this._assignValue(value);
  }
  private readonly _value = signal<D | null>(null);

  /** The minimum valid date. */
  @Input()
  get min(): D | null {
    return this._min();
  }
  set min(value: D | null) {
    const validValue = this._dateAdapter?.getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._min.set(validValue);
    this._validatorOnChange();
  }
  private readonly _min = signal<D | null>(null);

  /** The maximum valid date. */
  @Input()
  get max(): D | null {
    return this._max();
  }
  set max(value: D | null) {
    const validValue = this._dateAdapter?.getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._max.set(validValue);
    this._validatorOnChange();
  }
  private readonly _max = signal<D | null>(null);

  /** Function that can be used to filter out dates within the datepicker. */
  @Input()
  get dateFilter(): (date: D) => boolean {
    return this._dateFilter();
  }
  set dateFilter(value: (date: D) => boolean) {
    const wasMatchingValue = this._matchesFilter(this.value);
    this._dateFilter.set(value);
    if (this._matchesFilter(this.value) !== wasMatchingValue) {
      this._validatorOnChange();
    }
  }
  private readonly _dateFilter = signal<(date: D) => boolean>(() => true);

  /** Whether the datepicker-input is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled();
  }
  set disabled(value: BooleanInput) {
    const newValue = coerceBooleanProperty(value);
    this._disabled.set(newValue);

    if (this.focused && newValue) {
      this.focused = false;
    }

    this.stateChanges.next();
  }
  private readonly _disabled = signal<boolean>(false);

  /** Emits when a `change` event is fired on this `<input>`. */
  @Output() readonly dateChange: EventEmitter<NgxMatDatetimePickerInputEvent<D>> = new EventEmitter<
    NgxMatDatetimePickerInputEvent<D>
  >();

  /** Emits when an `input` event is fired on this `<input>`. */
  @Output() readonly dateInput: EventEmitter<NgxMatDatetimePickerInputEvent<D>> = new EventEmitter<
    NgxMatDatetimePickerInputEvent<D>
  >();

  /** Emits when the internal state has changed */
  readonly stateChanges = new Subject<void>();

  _onTouched = () => {};
  _validatorOnChange = () => {};

  private _cvaOnChange: (value: any) => void = () => {};
  private _valueChangesSubscription = Subscription.EMPTY;
  private _localeSubscription = Subscription.EMPTY;

  /** The form control validator for whether the input parses. */
  private _parseValidator: ValidatorFn = (): ValidationErrors | null => {
    return this._lastValueValid
      ? null
      : { ngxMatDatetimePickerParse: { text: this._elementRef.nativeElement.value } };
  };

  /** The form control validator for the date filter. */
  private _filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter?.getValidDateOrNull(
      this._dateAdapter.deserialize(control.value),
    );
    return !controlValue || this._matchesFilter(controlValue)
      ? null
      : { ngxMatDatetimePickerFilter: true };
  };

  /** The form control validator for the min date. */
  private _minValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter?.getValidDateOrNull(
      this._dateAdapter.deserialize(control.value),
    );
    const min = this.min;
    return !min || !controlValue || this._dateAdapter!.compareDate(min, controlValue) <= 0
      ? null
      : { ngxMatDatetimePickerMin: { min: min, actual: controlValue } };
  };

  /** The form control validator for the max date. */
  private _maxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._dateAdapter?.getValidDateOrNull(
      this._dateAdapter.deserialize(control.value),
    );
    const max = this.max;
    return !max || !controlValue || this._dateAdapter!.compareDate(max, controlValue) >= 0
      ? null
      : { ngxMatDatetimePickerMax: { max: max, actual: controlValue } };
  };

  /** Gets the base validator functions. */
  private _getValidators(): ValidatorFn[] {
    return [this._parseValidator, this._minValidator, this._maxValidator, this._filterValidator];
  }

  /** The combined form control validator for this input. */
  private _validator: ValidatorFn | null = Validators.compose(this._getValidators());

  /** Tracks the last value that was set programmatically. */
  private _lastValueValid = false;

  // MatFormFieldControl implementation
  readonly controlType = 'ngx-mat-datetime-picker-input-v2';
  focused = false;

  get empty(): boolean {
    return !this._elementRef.nativeElement.value && !this.value;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  get required(): boolean {
    return this._required();
  }
  set required(value: BooleanInput) {
    this._required.set(coerceBooleanProperty(value));
    this.stateChanges.next();
  }
  private readonly _required = signal<boolean>(false);

  get placeholder(): string {
    return this._placeholder();
  }
  set placeholder(value: string) {
    this._placeholder.set(value);
    this.stateChanges.next();
  }
  private readonly _placeholder = signal<string>('');

  get errorState(): boolean {
    return this._errorState();
  }
  private readonly _errorState = signal<boolean>(false);

  // Unique ID for this input
  readonly id = `ngx-mat-datetime-picker-input-${Math.random().toString(36).substr(2, 9)}`;

  constructor() {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('NGX_MAT_DATE_FORMATS');
    }

    // Update the displayed date when the locale changes.
    this._localeSubscription = this._dateAdapter.localeChanges.subscribe(() => {
      this._assignValue(this.value);
    });
  }

  private readonly _injector = inject(Injector);

  ngOnInit(): void {
    console.log('🔧 NgxMatDatetimePickerInputV2 ngOnInit called');

    // Manually get NgControl to avoid circular dependency
    this.ngControl = this._injector.get(NgControl, null, { optional: true, self: true });
    console.log('🔧 NgControl found:', !!this.ngControl, this.ngControl?.constructor?.name);

    if (this.ngxMatDatetimePicker) {
      console.log('🔧 Registering input with datepicker');
      this.ngxMatDatetimePicker._registerInput(this);
    } else {
      console.log('❌ No datepicker available for registration');
    }
  }

  ngOnDestroy(): void {
    this._valueChangesSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this.stateChanges.complete();
  }

  /** @docs-private */
  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  /** @docs-private */
  validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

  // Disabled is handled by the component, but we have to satisfy the interface.
  writeValue(value: D | null): void {
    this._assignValue(value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
    console.log('CVA registerOnChange called', !!fn);
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _onKeydown(event: KeyboardEvent): void {
    const isAltDownArrow = event.altKey && event.keyCode === 40; // DOWN_ARROW

    if (this.ngxMatDatetimePicker && isAltDownArrow && !this._elementRef.nativeElement.readOnly) {
      this.ngxMatDatetimePicker.open();
      event.preventDefault();
    }
  }

  _onInput(value: string): void {
    const parsedDate = this._dateAdapter.parse(value, this._dateFormats.display.dateInput);
    this._lastValueValid = this._dateAdapter.isValid(parsedDate);
    let date = this._dateAdapter.getValidDateOrNull(parsedDate);

    // Update internal value
    this._value.set(date);

    // Notify form control
    this._cvaOnChange(date);

    // Emit input event
    this.dateInput.emit(new NgxMatDatetimePickerInputEvent(this, this._elementRef.nativeElement));
  }

  _onChange(): void {
    this.dateChange.emit(new NgxMatDatetimePickerInputEvent(this, this._elementRef.nativeElement));
  }

  _onBlur(): void {
    // Validate the input when losing focus
    if (this.value) {
      this._formatValue(this.value);
    }
    this.focused = false;
    this._onTouched();
    this.stateChanges.next();
  }

  _onClick(event: MouseEvent): void {
    // Open the datepicker when clicking on the input
    if (this.ngxMatDatetimePicker && !this.disabled) {
      this.ngxMatDatetimePicker.open();
    }
  }

  /** Formats a value and sets it on the input element. */
  private _formatValue(value: D | null): void {
    const formattedValue = value
      ? this._dateAdapter.format(value, this._dateFormats.display.dateInput)
      : '';
    this._elementRef.nativeElement.value = formattedValue;
  }

  /** Assigns a value to the model. */
  private _assignValue(value: D | null): void {
    // We may get some incoming values before the model was assigned. Save the value so that we can
    // re-assign it after the model is available.
    this._value.set(value);
    this._formatValue(value);
    this.stateChanges.next();
  }

  /** Public method to update value and trigger change events */
  updateValue(value: D | null): void {
    console.log('updateValue called with:', value, 'onChange available:', !!this._cvaOnChange);

    // Update the internal signal
    this._value.set(value);

    // Format and display the value in the input
    this._formatValue(value);

    // Notify the form control immediately
    if (this._cvaOnChange) {
      console.log('Calling _cvaOnChange with:', value);
      this._cvaOnChange(value);
    }

    // Emit our own change events
    this.dateChange.emit(new NgxMatDatetimePickerInputEvent(this, this._elementRef.nativeElement));

    // Mark as touched
    if (this._onTouched) {
      this._onTouched();
    }

    // Notify state changes
    this.stateChanges.next();
  }

  /** Whether the given value is considered valid. */
  private _matchesFilter(value: D | null): boolean {
    const filter = this.dateFilter;
    return !filter || !value || filter(value);
  }

  // MatFormFieldControl methods
  setDescribedByIds(ids: string[]): void {
    // Implementation for accessibility
  }

  onContainerClick(): void {
    this.focus();
  }

  focus(): void {
    this._elementRef.nativeElement.focus();
    this.focused = true;
    this.stateChanges.next();
  }

  /** Gets the element that the datepicker popup should be connected to. */
  getConnectedOverlayOrigin(): ElementRef {
    return this._formField?.getConnectedOverlayOrigin() || this._elementRef;
  }

  /** Implementation of NgxMatDatepickerControl interface methods */
  getStartValue(): D | null {
    return this.value;
  }

  getThemePalette(): ThemePalette {
    return 'primary'; // Default theme palette
  }

  getOverlayLabelId(): string | null {
    return this.id;
  }
}

/** An event used for datepicker input and change events. */
export class NgxMatDatetimePickerInputEvent<D> {
  /** The new value for the target datepicker input. */
  value: D | null;

  constructor(
    /** Reference to the datepicker input component that emitted the event. */
    public target: NgxMatDatetimePickerInputV2<D>,
    /** Reference to the native input element that the event originated from. */
    public targetElement: HTMLElement,
  ) {
    this.value = this.target.value;
  }
}
