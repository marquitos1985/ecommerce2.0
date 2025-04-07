import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';

export interface User {
  id?: string;
  name: string;
  lastname: string;
  birthdate: Date;
  province: string;
  city: string;
  street: string;
  streetNumber: string;
  floor: string;
  flat: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  //private apiUrl = 'http://localhost:3001/users';

  //private apiUrl = "http://localhost:8080/inventario-app/auth/register"; 
  private apiUrl = "https://booming-argon-447410-c0.rj.r.appspot.com/inventario-app/auth/register"; 

  

  constructor(private http: HttpClient, private userService: UserService) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  registerUser(user: User): Observable<User> {
    console.log(user);
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/${user.id}`; 
    return this.http.put<User>(url, user);
  }
  

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /* checkEmailExists(email: string): Observable<boolean> {
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}`)
      .pipe(map((users) => users.length > 0));
  } */

      checkEmailExists(email: string): Observable<boolean> {
        return this.userService.getUserByEmail(email);
      }
}
