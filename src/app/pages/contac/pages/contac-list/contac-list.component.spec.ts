import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ContacListComponent } from './contac-list.component';
import { ContacService } from '../../services/contac.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { of, throwError } from 'rxjs';
import { Contac, CreateContacts } from '../../models/contac.model';
import { AlertService } from 'src/app/services/alert.service';
import { DataStorageService } from '../shared/data-storage.service';
import { StatusCode } from 'src/app/enums/status-code.enum';
import { Router } from '@angular/router';


describe('ContacListComponent', () => {
  let component: ContacListComponent;
  let fixture: ComponentFixture<ContacListComponent>;
  let alertService: AlertService;
  let dataStorageService: DataStorageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, NgxPaginationModule],
      declarations: [ContacListComponent],
      providers: [ContacService, AlertService, DataStorageService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContacListComponent);
    component = fixture.componentInstance;
    alertService = TestBed.inject(AlertService);
    dataStorageService = TestBed.inject(DataStorageService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contacts on page change', () => {
    const offset = (component.p - 1) * component.limit; // Calcula el offset basado en los valores actuales de p y limit
    const loadContactsSpy = spyOn(component, 'loadContacts'); // Espiar el método loadContacts

    component.onPageChange(component.p); // Simula el cambio de página

    expect(loadContactsSpy).toHaveBeenCalledWith(offset);
  });

  it('should call showAlert on component initialization', () => {
    const showAlertSpy = spyOn(component, 'showAlert');

    component.ngOnInit();

    expect(showAlertSpy).toHaveBeenCalled();
  });

  it('debería navegar y guardar en el almacenamiento local al seleccionar un contacto', () => {
    const contactoMock: Contac = {
      contactId: 1,
      contactFirstName: 'Juan',
      contactLastName: 'Pérez',
      contactCompany: 'Ejemplo Corp',
      contactBirthday: '1990-01-01',
      contactNotes: 'Notas de prueba',
      contactAlias: 'Juanito',
      contactPhoto: 'ruta/de/la/foto.jpg',
      contactEmails: [
        { emailId: 1, emailValue: 'juan@example.com' }
      ],
      contactTags: [
        { tagId: 1, tagValue: 'Amigos' }
      ],
      contactPhones: [
        { phoneId: 1, phoneValue: '123-456-7890', phoneType: 'mobile' }
      ]
    };

    const localStorageSetItemSpy = spyOn(localStorage, 'setItem'); // Espiar el método setItem de localStorage
    const navigateSpy = spyOn(router, 'navigate'); // Espiar el método navigate del enrutador

    component.onContactSelected(contactoMock); // Llamar al método con el contacto de ejemplo

    // Verificar que se haya llamado localStorage.setItem con la clave 'selectedContact' y un valor.
    expect(localStorageSetItemSpy).toHaveBeenCalledWith('selectedContact', jasmine.any(String));

    // Verificar que se haya llamado router.navigate con los parámetros correctos.
    expect(navigateSpy).toHaveBeenCalledWith(['contac/list', contactoMock.contactId]);
  });

  it('debería navegar a la página de nuevo contacto cuando se hace clic en el botón "Agregar Contacto"', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.onNewContacto();

    expect(navigateSpy).toHaveBeenCalledWith(['contac/new']);
  });

  it('debería eliminar un contacto y actualizar la lista de contactos cuando se hace clic en el botón "Eliminar"', fakeAsync(() => {
    const contactToDelete: Contac = {
        contactId: 1,
        contactFirstName: 'Juan',
        contactLastName: 'Pérez',
        contactCompany: 'Ejemplo Corp',
        contactBirthday: '1990-01-01',
        contactNotes: 'Notas de prueba',
        contactAlias: 'Juanito',
        contactPhoto: 'ruta/de/la/foto.jpg',
        contactEmails: [
          { emailId: 1, emailValue: 'juan@example.com' }
        ],
        contactTags: [
          { tagId: 1, tagValue: 'Amigos' }
        ],
        contactPhones: [
          { phoneId: 1, phoneValue: '123-456-7890', phoneType: 'mobile' }
        ]
      };

      const deleteResponse: CreateContacts = {
        succeed: true,
        statusCode: StatusCode.Success,
        code: 200, // Puedes ajustar esto según corresponda
        result: {}, // Puedes ajustar esto según corresponda
        message: 'Contacto eliminado exitosamente.',
        friendlyMessage: ['Contacto eliminado exitosamente.'],
        htmlMessage: '', // Puedes ajustar esto según corresponda
        error: '', // Puedes ajustar esto según corresponda
        created: new Date() // Puedes ajustar esto según corresponda
      };

      spyOn(dataStorageService, 'deleteContacts').and.returnValue(of(deleteResponse));

      const alertShowConfirmationSpy = spyOn(alertService, 'showConfirmationAlert').and.returnValue(Promise.resolve({ isConfirmed: true }));

      const alertShowSuccessSpy = spyOn(alertService, 'showSuccessAlert').and.returnValue(Promise.resolve());

      component.onDeleteContact(contactToDelete);

      tick();

      expect(alertShowConfirmationSpy).toHaveBeenCalled();
      expect(dataStorageService.deleteContacts).toHaveBeenCalledWith(contactToDelete.contactId);
      expect(alertShowSuccessSpy).toHaveBeenCalled();

      // // Verificamos que la lista de contactos y el contador se hayan actualizado correctamente
      // expect(component.contact.length).toBe(0); // Esto asume que el contacto ha sido eliminado correctamente
      // expect(component.count).toBe(component.count - 1);
      // expect(component.contactoService.setContactCount).toHaveBeenCalledWith(component.count);
        }));

    it('debería cargar contactos correctamente', () => {
      const offset = 0;
      const responseMock = {
        succeed: true,
        statusCode: 200,
        code: 200,
        result: {
          list: [
            {
              contactId: 1,
              contactFirstName: 'Ardelia',
              contactLastName: 'Reichartz',
              contactCompany: 'Ntag',
              contactBirthday: '2002-03-14',
              contactNotes: 'United States Cellular Corporation',
              contactAlias: 'areichartz9',
              contactPhoto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIZSURBVDjLpZPPS1RRGIafe+feSccfacxACUFYDGaKlEmrqFVEi6Bdy7YmLqL6A1oEtQiCglZBtYhKKqiEFiGRUERQthhEjKi0UNSbkk73zjnfd1pMM2VpBB64i8OFh/flOa/nnGMtx7tzoq3g1HnqHKoOVUXUIaqoOkTK9+PXJtpXAgSq6vV0dyALBuOKWJdgBVSUb0lAfWMDz1++XjVBIOKMiebC8x2P8DxwDqxV5qOY6aklLtOHFf0HQNUPvVpMSfB9D3WOg0MH8iqKqPJeF8k113G9d+vMCrVygRXFqvI1igkCv/xThJ1dbdgFQ5qI2CzheakVawXWKsYIM9NF/JSHqqMkvitFkde7Z5I6r4i1isukqQnWka1t5uRjrdYKrIjGkDo1eWi7U0fFxuh4RN/Y7zaKWdElxs7mZ0OdwIpUABoOjxTYlGvk/2y0YIxg7XgZ0H/jczvAzf58YqK59LH2e2wJN5Cx8MnAlZ4L7M5+5NWld1hRMnWGIFisVvArOio2Utmj3He7iC1kgSdf9rNoNhNqhBXhyMAoSRIj+gegYqOplKGrYZ6p5jzWv8tAoZuGW6cxpgVrlcGHbxgcfotIeQJBFfDTRseO9XTW91HDDCPfz5Ekt2lt2kZwsRz7zIP53LKH9CuBaAwcvjqFF87Sum8je+nkw7MJCF6QJFKNvQpA08MjBUQVEcfToeWjqnx/rXGtc/4BfOeC6F88S7oAAAAASUVORK5CYII=',
              contactEmails: [
                {
                  emailId: 1,
                  emailValue: 'kbreslauer0@github.io'
                }
              ],
              contactTags: [
                {
                  tagId: 1,
                  tagValue: 'Transcof'
                }
              ],
              contactPhones: [
                {
                  phoneId: 1,
                  phoneValue: '3397815680',
                  phoneType: 'whatsapp'
                }
              ]
            }
          ],
          count: 195
        },
        message: 'Contacts Data.',
        friendlyMessage: ['Listado de Contactos Exitoso.'],
        error: '',
        created: new Date(),
      };

  spyOn(dataStorageService, 'storageContacts').and.returnValue(of(responseMock));

  const loadContactsSpy = spyOn(component, 'loadContacts').and.callThrough();
  const alertCloseSpy = spyOn(component.alertInstance, 'close');

  component.onPageChange(1);

  expect(loadContactsSpy).toHaveBeenCalledWith(offset);
  expect(alertCloseSpy).toHaveBeenCalled();

  dataStorageService.storageContacts(offset, component.limit).subscribe((response) => {
    expect(response).toEqual(responseMock);
  });

  expect(component.contact).toEqual(responseMock.result.list);
  expect(component.contactCount).toBe(responseMock.result.count);
    });

  it('debería manejar el error de la API al cargar contactos', () => {
    const offset = 0;
    const errorResponse = 'Mensaje de error de la API';

    const storageContactsSpy = spyOn(dataStorageService, 'storageContacts').and.returnValue(throwError(errorResponse));

    const alertCloseSpy = spyOn(component.alertInstance, 'close');
    const consoleErrorSpy = spyOn(console, 'error');

    component.onPageChange(1);

    expect(storageContactsSpy).toHaveBeenCalledWith(offset, component.limit);
    expect(alertCloseSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading contacts:', errorResponse);
  });

})












