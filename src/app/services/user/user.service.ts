import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/inventario-app/users';

  constructor(private http: HttpClient) { }

  public getUserByEmail(email: string):Observable<any>{
    console.log(this.apiUrl + "/" + email);
    return this.http.get<any>(this.apiUrl + "/" + email);
  }
}
