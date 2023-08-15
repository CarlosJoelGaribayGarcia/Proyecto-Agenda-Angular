import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showSuccessAlert(title: string, message: string): Promise<any> {
    const alertOptions: SweetAlertOptions = {
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    };

    return Swal.fire(alertOptions);
  }

  showErrorAlert(title: string, message: string): Promise<any> {
    const alertOptions: SweetAlertOptions = {
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    };

    return Swal.fire(alertOptions);
  }

  showCustomAlert(options: SweetAlertOptions): Promise<any> {
    return Swal.fire(options);
  }

  showConfirmationAlert(title: string, text: string): Promise<any> {
    const alertOptions: SweetAlertOptions = {
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    };

    return Swal.fire(alertOptions);
  }

  showLogoutConfirmationAlert(): Promise<any> {
    const alertOptions: SweetAlertOptions = {
      title: 'Estas Seguro',
      text: '¿Deseas cerrar la sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    };

    return Swal.fire(alertOptions);
  }
}



