import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
  selector: '[appDesplegable]'
})
export class DesplegableDirective {
  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }

}