import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Observable, Subject, tap} from "rxjs";
import { DataResult, LoginModel } from "../models/login.model";
import { environment } from 'src/environment/environment-url';
import { LocalStorageService } from "src/app/services/local-storage.service";
import { Router } from "@angular/router";


@Injectable({providedIn: 'root'})
export class LoginService  implements OnInit {
  // private headers = new HttpHeaders().set('Content-Type', 'application/json').set('X-API-Key','7802c4c0');


  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService,
              private router: Router) { }

ngOnInit() {
// Llama al método autoLogout al cargar la aplicación
  this.autoLogout();
}

  tokensAuthentication(token: string, expiresAt: Date, refreshToken: string) {

    this.localStorageService.setItem('accessToken', token);
    this.localStorageService.setItem('expiresAt', expiresAt.toString());
    this.localStorageService.setItem('refreshToken', refreshToken);
  }

  autoLogout() {
    const expirationDate = new Date(this.localStorageService.getItem('expiresAt'));
    const timeRemaining = expirationDate.getTime() - Date.now();

    setTimeout(() => {
      this.tokenExperied().subscribe((res: LoginModel) => {
        console.log('Respuesta del tokenExperied:', res);

      });
    }, timeRemaining);
  }


  Login(authUser: string, authPassword: string): Observable<LoginModel> {
    const body = {
      authUser: authUser,
      authPassword: authPassword
    };
    return this.http.put<LoginModel>(`${environment.apiUrl}/auth/login`, body)
      .pipe(
        tap((res: LoginModel) => {
          if (res.succeed) {
            const data: DataResult = res.result;
            const newExpiresAt = new Date();
            newExpiresAt.setMinutes(newExpiresAt.getMinutes() + 1);
            console.log("login"+data.expiresAt, newExpiresAt);
            this.tokensAuthentication(
              data.accessToken,
              newExpiresAt,
              data.refreshToken
            );
          }
        })
      );
  }


  logOut(): Observable<LoginModel>{
    return this.http.
    delete<LoginModel>(`${environment.apiUrl}/auth/logout`);
  }

  refreshToken(): Observable<LoginModel>{
    const refreshToken = this.localStorageService.getItem('refreshToken');
    const body = { "refreshToken": refreshToken };
    return this.http.
    post<LoginModel>(`${environment.apiUrl}/auth/refresh`, body)
    .pipe(
      tap((res: LoginModel) => {
        if (res.succeed) {
          const data: DataResult = res.result;
          const newExpiresAt = new Date();
          newExpiresAt.setMinutes(newExpiresAt.getMinutes() + 1);
          console.log("Token refrescado:" + data.expiresAt, newExpiresAt);
          this.tokensAuthentication(
            data.accessToken,
            newExpiresAt,
            data.refreshToken
          );
        }
      })
    );
}
  tokenExperied(): Observable<LoginModel>{
    const body = {};
    return this.http.
    post<LoginModel>(`${environment.apiUrl}/token/expired`,body);
  }

}
