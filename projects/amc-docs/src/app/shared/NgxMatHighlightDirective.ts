import { afterNextRender, Directive, ElementRef, inject } from "@angular/core";
import hljs from "highlight.js";

@Directive({
  selector: "code[ngxMatHighlight]",
})
export class NgxMatHighlightDirective {
  private readonly eltRef = inject(ElementRef)

  constructor() {
    afterNextRender(() => {
      // Safely access hljs without dependency injection
      if (hljs && hljs.highlightElement) {
        hljs.highlightElement(this.eltRef.nativeElement);
      }
    });
  }
}
