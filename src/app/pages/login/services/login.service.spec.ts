import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment-url';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { of, throwError } from 'rxjs';


describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService, LocalStorageService, Router],
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call autoLogout() on ngOnInit', () => {
    const autoLogoutSpy = spyOn(service, 'autoLogout');

    service.ngOnInit();

    expect(autoLogoutSpy).toHaveBeenCalled();
  });

  it('should log in successfully', () => {
    const authUser = 'testUser';
    const authPassword = 'testPassword';

    const mockResponse = {
      succeed: true,
      statusCode: 200,
      code: 200,
      result: {
        accessToken: '12345678at',
        refreshToken: '12345678rt',
        expiresAt: 'Tue Sep 06 2022 23:03:07 GMT+0000 (Coordinated Universal Time)',
      },
      message: '',
      friendlyMessage: [''],
      htmlMessage: '',
      error: '',
      created: new Date(),
    };

    service.Login(authUser, authPassword).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('debería refrescar el token exitosamente', () => {
    const mockRefreshResponse = {
      succeed: true,
      statusCode: 200,
      code: 200,
      result: {
        accessToken: '12345678at',
        refreshToken: '12345678rt',
        expiresAt: 'Tue Sep 06 2022 23:03:07 GMT+0000 (Coordinated Universal Time)',
      },
      message: '',
      friendlyMessage: [''],
      htmlMessage: '',
      error: '',
      created: new Date(),
    };

    service.refreshToken().subscribe((response) => {
      expect(response).toEqual(mockRefreshResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    req.flush(mockRefreshResponse);
  });

  it('debería verificar tokenExperied exitosamente', () => {
    const mockExpiredResponse = {
      succeed: false,
      statusCode: 401,
      code: 401,
      result: {},
      message: "",
      friendlyMessage: ["Usuario no autorizado"],
      htmlMessage: "",
      error: "Usuario no autorizado",
      created: new Date(),
    };

    service.tokenExperied().subscribe((response) => {
      expect(response).toEqual(mockExpiredResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/token/expired`);
    expect(req.request.method).toBe('POST');
    req.flush(mockExpiredResponse);
  });

  it('debería hacer logout exitosamente', () => {
    const mockLogoutResponse = {
      succeed: true,
      statusCode: 200,
      code: 200,
      result: {},
      message: "Sesión cerrada.",
      friendlyMessage: ["Sesión cerrada."],
      htmlMessage: "",
      error: "",
      created: new Date(),

    };

    service.logOut().subscribe((response) => {
      expect(response).toEqual(mockLogoutResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockLogoutResponse);
  });

  it('debería ejecutar autoLogout correctamente', fakeAsync(() => {
    const mockTokenExpiredResponse = {
      succeed: false,
      statusCode: 401,
      code: 401,
      result: {},
      message: "",
      friendlyMessage: ["Usuario no autorizado"],
      htmlMessage: "",
      error: "Usuario no autorizado",
      created: new Date(),
    };

    const tokenExpiredSpy = spyOn(service, 'tokenExperied').and.returnValue(of(mockTokenExpiredResponse));

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 1);
    const timeRemaining = expiresAt.getTime() - Date.now();

    service.autoLogout();

    tick(timeRemaining);

    expect(tokenExpiredSpy).toHaveBeenCalled();

  }));

  it('should handle login error', () => {
    const authUser = 'testUser';
    const authPassword = 'testPassword';

    service.Login(authUser, authPassword).subscribe(
      () => fail('Expected an error'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(400); // Simulate a specific error status
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('PUT');
    req.flush(null, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle refresh token error', () => {

    service.refreshToken().subscribe(
      () => fail('Expected an error'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(401); // Simulate a specific error status
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    req.flush(null, { status: 401, statusText: 'unauthorized user' });
  });

  it('should handle autoLogout with expired token', fakeAsync(() => {
    const mockTokenExpiredResponse = {
      succeed: true,
      statusCode: 200,
      code: 200,
      result: {},
      message: "",
      friendlyMessage: [""],
      htmlMessage: "",
      error: "",
      created: new Date(),
    };

    spyOn(service, 'tokenExperied').and.returnValue(of(mockTokenExpiredResponse)); // Simulate token expired

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() - 1); // Expired token
    const timeRemaining = expiresAt.getTime() - Date.now();

    service.autoLogout();

    tick(timeRemaining);

    expect(service['tokenExperied']).toHaveBeenCalled(); // 'tokenExperied' is a private method, hence the use of ['']

  }));

});
