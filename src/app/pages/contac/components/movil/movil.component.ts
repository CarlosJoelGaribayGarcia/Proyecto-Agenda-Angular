import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent {
  phoneForm: FormGroup;

  @Output() addPhoneEvent = new EventEmitter<{ phoneType: string, phoneValue: string }>();

  constructor() {
    this.phoneForm = new FormGroup({
      lada: new FormControl('', [Validators.pattern('[0-9]{1,3}'), Validators.required]),
      telefono: new FormControl('', [Validators.pattern('[0-9]{1,7}'), Validators.required])
    });
  }

  addPhone() {
    if (this.phoneForm.invalid) {
      return;
    }
    const phoneValue = `${this.phoneForm.get('lada').value}${this.phoneForm.get('telefono').value}`;
    this.addPhoneEvent.emit({ phoneType: 'mobile', phoneValue: phoneValue });
    this.phoneForm.reset();
  }

}
