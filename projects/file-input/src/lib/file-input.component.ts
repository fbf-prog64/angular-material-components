import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';

import {
  ChangeDetectorRef,
  Component,
  Directive,
  DoCheck,
  ElementRef,
  forwardRef,
  inject,
  Input,
  input,
  OnChanges,
  OnDestroy,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, ThemePalette } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { FileOrArrayFile } from './file-input-type';

let nextUniqueId = 0;

class NgxMatInputMixinBase {

  readonly stateChanges = new Subject<void>();

  protected ngControl: NgControl | null = null;
  protected _parentForm: NgForm | null = null;
  protected _parentFormGroup: FormGroupDirective | null = null;
  protected _defaultErrorStateMatcher: ErrorStateMatcher | null = null;

}

@Directive({
  selector: '[ngxMatFileInputIcon]',
})
export class NgxMatFileInputIcon {}

@Component({
  selector: 'ngx-mat-file-input',
  templateUrl: 'file-input.component.html',
  styleUrls: ['file-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngx-mat-file-input',
  },
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => NgxMatFileInputComponent),
    },
  ],
  exportAs: 'ngx-mat-file-input',
  imports: [MatIconModule, MatButtonModule],
})
export class NgxMatFileInputComponent
  extends NgxMatInputMixinBase
  implements MatFormFieldControl<FileOrArrayFile>, OnChanges, OnDestroy, DoCheck, ControlValueAccessor
{
  private _inputFileRef = viewChild<ElementRef>('inputFile');
  private _inputValueRef = viewChild<ElementRef>('inputValue');

  readonly color = input<ThemePalette>('primary');

  public fileNames = "";

  protected _uid = `ngx-mat-fileinput-${nextUniqueId++}`;
  _ariaDescribedby = "";

  override stateChanges: Subject<void> = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'ngx-mat-file-input';
  autofilled = false;

  /** Function when touched */
  _onTouched = () => {
    // Intentionally empty.
  };

  /** Function when changed */
  _onChange: (value: FileOrArrayFile) => void = () => {
    // Intentionally empty.
  };

  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  protected _disabled = false;

  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }
  protected _id = "";

  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }
  protected _multiple = false;

  @Input()
  placeholder = 'Choose a file';
  separator = input<string>(',');

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  protected _required = false;

  @Input() errorStateMatcher: ErrorStateMatcher | null = null;

  @Input()
  get value(): FileOrArrayFile | null {
    return this._value;
  }
  set value(value: FileOrArrayFile) {
    this._value = value;
  }
  protected _value: FileOrArrayFile | null = null;

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }
  private _readonly = true;

  /**
   * Limiting accepted file types
   * Example: accept="image/png, image/jpeg" or accept=".png, .jpg, .jpeg" — Accept PNG or JPEG files.
   */
  @Input()
  get accept(): string {
    return this._accept;
  }
  set accept(value: string) {
    this._accept = value;
  }
  private _accept = "";

  protected _elementRef = inject(ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>);
  protected _platform = inject(Platform);
  private _cd = inject(ChangeDetectorRef);

  override ngControl = inject(NgControl, { optional: true, self: true });
  protected override _parentForm = inject(NgForm, { optional: true });
  protected override _parentFormGroup = inject(FormGroupDirective, { optional: true });
  protected override _defaultErrorStateMatcher = inject(ErrorStateMatcher);

  constructor() {
    super();

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  updateErrorState() {
    const control = this.ngControl ? this.ngControl.control : null;

    this.errorState = (this.errorStateMatcher ?? this._defaultErrorStateMatcher).isErrorState(
      control,
      this._parentForm,
    );
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: FileOrArrayFile): void {
    this._updateInputValue(value);
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: FileOrArrayFile) => void): void {
    this._onChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }

  /** Focuses the input. */
  focus(options?: FocusOptions): void {
    this._inputValueRef()?.nativeElement.focus(options);
  }

  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  /** Mark the field as touched */
  _markAsTouched() {
    this._onTouched();
    this._cd.markForCheck();
    this.stateChanges.next();
  }

  protected _isBadInput() {
    const validity = (this._inputValueRef()?.nativeElement as HTMLInputElement).validity;
    return validity && validity.badInput;
  }

  get empty(): boolean {
    return !this._inputValueRef()?.nativeElement.value && !this._isBadInput() && !this.autofilled;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  setDescribedByIds(ids: string[]) {
    this._ariaDescribedby = ids.join(' ');
  }

  openFilePicker(event?: MouseEvent) {
    this._inputFileRef()?.nativeElement.click();
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this._markAsTouched();
  }

  handleFiles(filelist: FileList) {
    if (filelist.length > 0) {
      const files: File[] = [];
      for (let i = 0; i < filelist.length; i++) {
        const f = filelist.item(i);
        if (f)
          files.push(f);
      }
      this._updateInputValue(files);
      this._resetInputFile();
      this._onChange(this.multiple ? files : files[0]);
    }
  }

  /** Handles a click on the control's container. */
  onContainerClick(_: MouseEvent) {
    // Intentionally empty.
  }

  private _resetInputFile() {
    this._inputFileRef()!.nativeElement.value = '';
  }

  private _updateInputValue(files: FileOrArrayFile) {
    let text = null;
    if (files) {
      if (Array.isArray(files)) {
        text = this._multiple ? files.map((x) => x.name).join(this.separator()) : files[0].name;
      } else {
        text = files.name != null ? files.name : null;
      }
    }

    this._inputValueRef()!.nativeElement.value = text;
  }
}
