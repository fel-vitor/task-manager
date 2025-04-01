import { Directive, effect, ElementRef, HostBinding, inject, input } from '@angular/core';

const buttonClasses = new Map<string, string>([
  ['neutral', 'btn-neutral'],
  ['primary', 'btn-primary'],
  ['secondary', 'btn-secondary'],
  ['accent', 'btn-accent'],
  ['info', 'btn-info'],
  ['success', 'btn-success'],
  ['warning', 'btn-warning'],
  ['error', 'btn-error'],
]);

@Directive({
  selector: '[appButton]',
  standalone: true,
})
export class ButtonDirective {

  btnType = input.required<string>({ alias: 'appButton' });

  elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  @HostBinding('class.btn')
  addBtnClass = true;

  constructor() {
    effect(() => {
      const btnType = this.btnType();

      if(buttonClasses.has(btnType)) {
        const btnClass = buttonClasses.get(btnType) as string;

        this.elementRef.nativeElement.classList.add(btnClass);
      }
    })
  }
}

@Directive({
  selector: '[appButtonXs]',
  standalone: true,
  hostDirectives: [{
    directive: ButtonDirective,
    inputs: ['appButton: appButtonXs'],
  }],
})
export class ButtonXsDirective {

  @HostBinding('class.btn-xs')
  addBtnClass = true;

}
