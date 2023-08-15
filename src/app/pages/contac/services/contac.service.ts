import { EventEmitter } from "@angular/core";
import { Contac } from "../models/contac.model";
import { BehaviorSubject, Subject } from "rxjs";

export class ContacService{

  // contactChanged  = new Subject<Contac[]>();

  contactChanged = new BehaviorSubject<Contac[]>([]);
  contactoSelected = new EventEmitter<Contac>();

  private contact: Contac[] = [];

  private contactCount = new BehaviorSubject<number>(10);
  contactCount$ = this.contactCount.asObservable();

  setContacto(contact: Contac[]) {
    this.contact = contact;
    this.contactChanged.next(this.contact.slice());
  }

  getContacto() {
    return this.contact.slice();
  }

  getContactos(index: number) {
    return this.contact[index];

}
addContact(contact: Contac) {
  this.contact.push(contact);
  this.contactChanged.next(this.contact.slice());
  this.contactCount.next(this.contactCount.value + 1); // Incrementar el contador en 1
}

// deleteContact(contact: Contac) {
//   const index = this.contact.indexOf(contact);
//   if (index !== -1) {
//     this.contact.splice(index, 1);
//     this.contactChanged.next(this.contact.slice());
//     this.contactCount.next(this.contactCount.value - 1); // Decrementar el contador en 1
//   }
// }

    setContactCount(count: number) {
      this.contactCount.next(count);
    }

    getContactCount() {
      return this.contactCount.asObservable();
    }



}
