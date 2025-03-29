import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../register-service/register.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/inventario-app/users';

  constructor(private http: HttpClient) { }

  public getUserByEmail(email: string):Observable<any>{
    
    return this.http.get<any>(this.apiUrl + "/email/" + email);
  }

  public getUserById(id: string): Observable<User> {
      return this.http.get<User>(this.apiUrl + "/id/" + id);
    }

  public updateUser(user: User): Observable<User> {
      const url = this.apiUrl + "/update/userData"; 
      return this.http.put<User>(url, user);
    }
    public verifyPassword(user: User, pass: string): Observable<boolean>{
      const url = this.apiUrl + "/verify-pass/" + pass;
      return this.http.post<boolean>(url, user);
    }
    public changePass(id: string, pass: string): Observable<User>{
      const url = this.apiUrl + "/update/pass/" + id;
      return this.http.put<User>(url, pass);

    }
}
