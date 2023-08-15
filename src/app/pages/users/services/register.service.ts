import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject} from "rxjs";
import {UserModel, Users} from "../models/user.model";
import { environment } from 'src/environment/environment-url';


@Injectable({providedIn: 'root'})
export class RegisterService {
  // private headers = new HttpHeaders().set('Authorization','Bearer 12345678at' ).set('Content-Type', 'application/json').set('X-API-Key','7802c4c0');

  private userDataSubject: Subject<Users> = new Subject<Users>();
  userData$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient) { }


  signup(user: Users): Observable<UserModel> {

    return this.http.
    post<UserModel>(`${environment.apiUrl}/users/create`, user);
  }

  getUser(id:string): Observable<UserModel> {

    return this.http.
    get<UserModel>(`${environment.apiUrl}/users/profile/${id}`);

  }

  getUsers(): Observable<UserModel> {
    const body = {
      "offset": 0,
      "limit": 10,
      "searchTerm": ""
    };
    return this.http.
    put<UserModel>(`${environment.apiUrl}/users`, body);
  }

  updateUser(user: Users): Observable<UserModel> {
    return this.http.
    put<UserModel>(`${environment.apiUrl}/users/update/1`, user);
  }

  setUserData(user: Users) {
    this.userDataSubject.next(user);
  }


}
