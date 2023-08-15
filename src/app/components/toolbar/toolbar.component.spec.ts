import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToolbarComponent } from './toolbar.component';
import { LoginService } from '../../pages/login/services/login.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { RegisterService } from '../../pages/users/services/register.service';
import { ContacService } from '../../pages/contac/services/contac.service';
import { AlertService } from '../../services/alert.service';
import { Users } from '../../pages/users/models/user.model';
import { of } from 'rxjs';
import { LoginModel } from 'src/app/pages/login/models/login.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';


describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let loginService: LoginService;
  let localStorageService: LocalStorageService;
  let registerService: RegisterService;
  let contacService: ContacService;
  let alertService: AlertService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ToolbarComponent],
      providers: [
        LoginService,
        LocalStorageService,
        RegisterService,
        ContacService,
        AlertService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService);
    localStorageService = TestBed.inject(LocalStorageService);
    registerService = TestBed.inject(RegisterService);
    contacService = TestBed.inject(ContacService);
    alertService = TestBed.inject(AlertService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // Aquí comienzan las pruebas

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update user data on initialization', () => {
    const userData: Users = {
      userFullName: 'John Doe',
      userName: 'johndoe',
      userPassword: 'password',
      userEmail: 'johndoe@example.com',
      userPhoto: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIZSURBVDjLpZPPS1RRGIafe+feSccfacxACUFYDGaKlEmrqFVEi6Bdy7YmLqL6A1oEtQiCglZBtYhKKqiEFiGRUERQthhEjKi0UNSbkk73zjnfd1pMM2VpBB64i8OFh/flOa/nnGMtx7tzoq3g1HnqHKoOVUXUIaqoOkTK9+PXJtpXAgSq6vV0dyALBuOKWJdgBVSUb0lAfWMDz1++XjVBIOKMiebC8x2P8DxwDqxV5qOY6aklLtOHFf0HQNUPvVpMSfB9D3WOg0MH8iqKqPJeF8k113G9d+vMCrVygRXFqvI1igkCv/xThJ1dbdgFQ5qI2CzheakVawXWKsYIM9NF/JSHqqMkvitFkde7Z5I6r4i1isukqQnWka1t5uRjrdYKrIjGkDo1eWi7U0fFxuh4RN/Y7zaKWdElxs7mZ0OdwIpUABoOjxTYlGvk/2y0YIxg7XgZ0H/jczvAzf58YqK59LH2e2wJN5Cx8MnAlZ4L7M5+5NWld1hRMnWGIFisVvArOio2Utmj3He7iC1kgSdf9rNoNhNqhBXhyMAoSRIj+gegYqOplKGrYZ6p5jzWv8tAoZuGW6cxpgVrlcGHbxgcfotIeQJBFfDTRseO9XTW91HDDCPfz5Ekt2lt2kZwsRz7zIP53LKH9CuBaAwcvjqFF87Sum8je+nkw7MJCF6QJFKNvQpA08MjBUQVEcfToeWjqnx/rXGtc/4BfOeC6F88S7oAAAAASUVORK5CYII=',
    };

    spyOn(localStorageService, 'getItem').and.returnValue(userData);

    component.ngOnInit();

    expect(localStorageService.getItem).toHaveBeenCalledWith('user');
    expect(component.userData).toEqual(userData);
  });

  it('should log out user', fakeAsync(() => {
    const routerSpy = spyOn(component.router, 'navigate');
    const logoutResponse = {
      succeed: true,
      statusCode: 200,
      code: 200,
      result: {},
      message: 'Sesión cerrada.',
      friendlyMessage: ['Sesión cerrada.'],
      htmlMessage: '',
      error: '',
      created: new Date(),
    };
    spyOn(alertService, 'showLogoutConfirmationAlert').and.returnValue(Promise.resolve({ isConfirmed: true }));
    spyOn(loginService, 'logOut').and.returnValue(of(logoutResponse));
    spyOn(localStorageService, 'removeItem');

    component.onLogOut();
    tick();

    expect(alertService.showLogoutConfirmationAlert).toHaveBeenCalled();
    expect(loginService.logOut).toHaveBeenCalled();
    expect(localStorageService.removeItem).toHaveBeenCalledWith('accessToken');
    expect(localStorageService.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(localStorageService.removeItem).toHaveBeenCalledWith('user');
    expect(component.userData).toBeNull();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  }));

  it('should navigate to edit user page', () => {
    const routerSpy = spyOn(component.router, 'navigate');

    component.onEditUser();

    expect(routerSpy).toHaveBeenCalledWith(['/register', 'edit']);
  });

  it('should navigate to /about', () => {
    const routerSpy = spyOn(router, 'navigate'); // Create a spy on router.navigate

    component.onAbout();

    expect(routerSpy).toHaveBeenCalledWith(['/about']); // Expect navigate to be called with ['/about']
  });

});
