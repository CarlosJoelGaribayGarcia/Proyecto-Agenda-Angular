import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable} from "rxjs";
import { Contac, CreateContacts, DataResponse } from "../../models/contac.model";
import { environment } from 'src/environment/environment-url';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  // private headers = new HttpHeaders().set('Authorization', 'Bearer 12345678at' ).set('Content-Type', 'application/json').set('X-API-Key','7802c4c0');
  constructor(private http: HttpClient) { }

  storageContacts(offset: number, limit: number): Observable<DataResponse>{
    const body = {
      "offset": offset,
      "limit": limit,
      "searchTerm": ""
    };
    return this.http.
    put<DataResponse>(`${environment.apiUrl}/contacts`, body);
  }

  createContacts(contact: Contac ): Observable<CreateContacts>{

    return this.http.
    post<CreateContacts>(`${environment.apiUrl}/contacts/create`, contact);
  }

  updateContacts(contact: Contac, id: number): Observable<CreateContacts>{

    return this.http.
    put<CreateContacts>(`${environment.apiUrl}/contacts/update/${id}`, contact);
  }


  deleteContacts(id: number): Observable<CreateContacts>{

    return this.http.
    delete<CreateContacts>(`${environment.apiUrl}/contacts/delete/${id}`);
  }

}
