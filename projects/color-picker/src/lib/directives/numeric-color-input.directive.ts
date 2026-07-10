import { Directive, HostListener } from '@angular/core';
import { NUMERIC_REGEX } from '../helpers';

@Directive({
  selector: '[ngxMatNumericColorInput]',
})
export class NumericColorInputDirective {
  @HostListener('input', ['$event'])
  onInput($event: InputEvent) {
    this._formatInput($event.target as HTMLInputElement | null);
  }

  /**
   * Format input
   * @param input
   */
  private _formatInput(input: HTMLInputElement | null) {
    if (!input)
      return;

    let val = Number(input.value.replace(NUMERIC_REGEX, ''));
    val = isNaN(val) ? 0 : val;
    input.value = val.toString();
  }
}
