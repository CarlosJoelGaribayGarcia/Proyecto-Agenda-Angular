import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-casa',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css']
})
export class PhoneComponent {
  phoneForm: FormGroup;

  @Output() addPhoneEvent = new EventEmitter<{ phoneType: string, phoneValue: string }>();

  constructor() {
    this.phoneForm = new FormGroup({
      telefono: new FormControl('', [Validators.pattern('[0-9]{1,7}'), Validators.required])
    });
  }

addPhone() {
  if (this.phoneForm.invalid) {
    return;
  }
  this.addPhoneEvent.emit({ phoneType: 'phone', phoneValue: this.phoneForm.get('telefono').value });
  this.phoneForm.reset();
}

}
