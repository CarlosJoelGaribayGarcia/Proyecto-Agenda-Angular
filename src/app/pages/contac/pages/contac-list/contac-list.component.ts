import { Component, OnDestroy, OnInit} from '@angular/core';
import { Contac, ResultData } from '../../models/contac.model';
import { ContacService } from '../../services/contac.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import Swal, { SweetAlertOptions} from 'sweetalert2';
import { AlertService } from 'src/app/services/alert.service';
import { StatusCode } from 'src/app/enums/status-code.enum';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-contac-list',
  templateUrl: './contac-list.component.html',
  styleUrls: ['./contac-list.component.scss']
})
export class ContacListComponent implements OnInit, OnDestroy {
  contact: Contac[] = [];
  subscription: Subscription;
  p: number = 1;
  contactCount= 0;
  limit: number = 10;
  count = 0;
  alertInstance: any;

  constructor(public contactoService: ContacService,
              private router: Router,
              private route: ActivatedRoute,
              public dataStorage: DataStorageService,
              private localStorageService: LocalStorageService,
              public alertService: AlertService
                ) {


  }

  ngOnInit() {

    this.showAlert();

    this.loadContacts(0);

    this.subscription = this.contactoService.contactChanged
      .subscribe(contact => {
        this.contact = contact;
        }
      );

    this.contact = this.contactoService.getContacto();

    this.subscription = this.contactoService.getContactCount().subscribe((dataCount) => {
      this.count = dataCount;
    });
  }

  showAlert() {
    const alertOptions: SweetAlertOptions = {
      title: 'Recuperando Listado de Contactos',
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    };
    this.alertInstance = Swal.fire(alertOptions);
  }


  onPageChange(event: number) {
    this.p = event;
    this.paginationConfig.currentPage = this.p;

    const offset = (this.p - 1) * this.limit;
    console.log(offset);
    this.loadContacts(offset);

    this.showAlert();
  }

  paginationConfig: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.limit,
    currentPage: this.p,
    totalItems: this.contactCount
  };

  loadContacts(offset: number) {
    this.dataStorage.storageContacts(offset, this.limit).subscribe((response) => {
      // Cerrar la alerta una vez que recibas los contactos
      if (this.alertInstance) {
        this.alertInstance.close();
      }
      const data: ResultData = response.result;
      this.contact = data.list;
      this.contactCount = data.count;
      this.paginationConfig.totalItems = this.contactCount;
      this.paginationConfig.currentPage = this.p;
      console.log(this.paginationConfig.totalItems);
      console.log(this.paginationConfig.currentPage);
      console.log(this.contact);
    }, (error) => {
      // Cerrar la alerta si hay un error en la llamada a la API
      if (this.alertInstance) {
        this.alertInstance.close();
      }
      console.error('Error loading contacts:', error);
    });
  }



  onContactSelected(contacto: Contac) {
      // Guardar en el Local Storage
    this.localStorageService.setItem('selectedContact', contacto);
    this.router.navigate(['contac/list', contacto.contactId]);

  }

  onNewContacto() {
    this.router.navigate(['contac/new']);
  }

  onDeleteContact(contacto: Contac) {
    this.alertService
      .showConfirmationAlert('¿Estás seguro?', 'Estás a punto de eliminar el contacto')
      .then((result) => {
        if (result.isConfirmed) {
          this.dataStorage.deleteContacts(contacto.contactId).subscribe({
            next: (response) => {
              console.log(response);
              const message = response.friendlyMessage[0];
              const statusCode = response.statusCode;

              if (statusCode === StatusCode.Success) {
                this.alertService.showSuccessAlert(message, 'success')
                  .then(() => {
                    const index = this.contact.indexOf(contacto);
                    if (index !== -1) {
                      this.contact.splice(index, 1);
                      this.count -= 1;
                      this.contactoService.setContactCount(this.count);
                    }
                  });
              }
            }
          });
        }
      });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();

  }


}
