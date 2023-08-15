import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataStorageService } from './data-storage.service';
import { Contac, CreateContacts, DataEmails, DataPhones, DataResponse, DataTags } from '../../models/contac.model';
import { environment } from 'src/environment/environment-url';

describe('DataStorageService', () => {
  let service: DataStorageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataStorageService],
    });
    service = TestBed.inject(DataStorageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve contacts', () => {
    const offset = 0;
    const limit = 10;

    // Crear una respuesta simulada utilizando tu modelo de datos
    const mockResponse: DataResponse = {
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

    service.storageContacts(offset, limit).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/contacts`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should create a contact', () => {
    const mockContact: Contac = new Contac(
      1,
      'John',
      'Doe',
      'Company A',
      '1990-01-01',
      'Notes',
      'Alias',
      'photo.jpg',
      [new DataEmails(1, 'john@example.com')],
      [new DataTags(1, 'Tag A')],
      [new DataPhones(1, '123456789', 'Home')]
    );

    const mockResponse: CreateContacts = {
      succeed: true,
      statusCode: 200,
      code: 0,
      result: mockContact,
      message: 'Contact Register Successfully',
      friendlyMessage: ['contacto Registrado Correctamente'],
      htmlMessage: '',
      error: '',
      created: new Date('Sun Jul 10 2022 22:31:47 GMT+0000')
    };

    service.createContacts(mockContact).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/contacts/create`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update a contact', () => {
    const mockContact: Contac = new Contac(
      1,
      'Updated',
      'Contact',
      'Company B',
      '1995-05-05',
      'Updated Notes',
      'Updated Alias',
      'updated.jpg',
      [new DataEmails(1, 'updated@example.com')],
      [new DataTags(1, 'Updated Tag')],
      [new DataPhones(1, '987654321', 'Mobile')]
    );
    const contactId = 1;

    const mockResponse: CreateContacts = {
      succeed: true,
      statusCode: 200,
      code: 200,
      result: {},
      message: 'Contact Register Successfully',
      friendlyMessage: ['contacto Registrado Correctamente'],
      htmlMessage: '',
      error: '',
      created: new Date('Sun Jul 10 2022 22:31:47 GMT+0000')
    };

    service.updateContacts(mockContact, contactId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/contacts/update/${contactId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete a contact', () => {
    const contactId = 1;

    const mockResponse: CreateContacts = {
      succeed: true,
      statusCode: 200,
      code: 0,
      result: null,
      message: 'Contact deleted successfully',
      friendlyMessage: [],
      htmlMessage: '',
      error: '',
      created: new Date()
    };

    service.deleteContacts(contactId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/contacts/delete/${contactId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

});
