import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.css']
})
export class WhatsappComponent {

  phoneForm: FormGroup;

  @Output() addPhoneEvent = new EventEmitter<{ phoneType: string, phoneValue: string }>();


  constructor() {
    this.phoneForm = new FormGroup({
      clavePais: new FormControl('', [Validators.pattern('[A-Za-z0-9]{1,3}'), Validators.required]),
      lada: new FormControl('', [Validators.pattern('[0-9]{1,3}'), Validators.required]),
      telefono: new FormControl('', [Validators.pattern('[0-9]{1,7}'), Validators.required])
    });
  }

  addPhone() {
    if (this.phoneForm.invalid) {
      return;
    }
    const phoneValue = `${this.phoneForm.get('clavePais').value}${this.phoneForm.get('lada').value}${this.phoneForm.get('telefono').value}`;
    this.addPhoneEvent.emit({ phoneType: 'whatsapp', phoneValue: phoneValue });
    this.phoneForm.reset();
  }

}
