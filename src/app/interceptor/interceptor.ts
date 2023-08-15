import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Observable, catchError, switchMap, tap, throwError } from "rxjs";
import { StatusCode } from "../enums/status-code.enum";
import { Router } from "@angular/router";
import { AlertService } from "../services/alert.service";
import { LoginService } from "../pages/login/services/login.service";
import { LocalStorageService } from "../services/local-storage.service";
import { DataResult, LoginModel } from "../pages/login/models/login.model";


@Injectable()
export class Interceptor implements HttpInterceptor {

  private headers = new HttpHeaders()
    .set('Authorization', 'Bearer 12345678at')
    .set('Content-Type', 'application/json')
    .set('X-API-Key', '7802c4c0');

  constructor(private router: Router,
              private alertService: AlertService,
              private loginService: LoginService,
              private localStorageService: LocalStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authReq = req.clone({ headers: this.headers });

    return next.handle(authReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const statusCode = event.body?.statusCode;
          const friendlyMessage = event.body?.friendlyMessage;

          if (statusCode === StatusCode.Success) {
            // Verificar si la respuesta contiene los datos que esperamos
            if (!event.body?.result) {
              console.error("Respuesta del servidor sin datos:", event.body);
            }
          } else if (statusCode === StatusCode.BadRequest) {
            // Código de estado 400: solicitud incorrecta, por ejemplo, datos inválidos
            this.alertService.showErrorAlert(friendlyMessage, 'Error en el estado de la petición');
          } else if (statusCode === StatusCode.Unauthorized) {
            // Código de estado 401: no autorizado, por ejemplo, token expirado o inválido
            this.loginService.refreshToken().subscribe({
              next: (data: LoginModel) => {
                if (data.succeed) {
                  this.loginService.autoLogout();
                  this.alertService.showSuccessAlert('Token refrescado exitosamente', 'Token Actualizado');
                  console.log("Token refrescado correctamente", data);
                }
              },
              error: (error: any) => {
                this.alertService.showErrorAlert('Token inválido, inicie sesión nuevamente', 'Token expirado');
                this.router.navigate(['/login']);
                throwError(error);
              }
            });

            } else {
            // Manejar otros códigos de estado o valores no reconocidos aquí
            console.error("Código de estado no manejado:", statusCode);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        let errorMessage = 'Ha ocurrido un error';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.alertService.showErrorAlert(errorMessage, 'Error al procesar la solicitud');
        return throwError(error);
      })
    );
  }
}
