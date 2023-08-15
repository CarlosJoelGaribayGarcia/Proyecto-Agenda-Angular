import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storageUpdated = new Subject<void>();

  constructor() { }

  // Método para obtener un elemento del local storage
  getItem(key: string): any {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  // Método para guardar un elemento en el local storage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
    this.storageUpdated.next();
  }

  // Método para eliminar un elemento del local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.storageUpdated.next();
  }

  storageUpdated$() {
    return this.storageUpdated.asObservable();
  }
}
