import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Role } from '../../models/users/role';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3001';
  

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .get<{ id: number; email: string; password: string; name: string, role: Role }[]>(
        `${this.apiUrl}/users?email=${email}&password=${password}`
      )
      .pipe(
        map((users) => {
          const user = users.find(
            (u) => u.email === email && u.password === password
          );
  
          if (user) {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('auth_token', 'your_token');
              sessionStorage.setItem('email', user.email);
              sessionStorage.setItem('userId', String(user.id));
              sessionStorage.setItem('name', user.name);
              sessionStorage.setItem('role', String(user.role)); 
              
            }
            
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(
            () => new Error('Error en login: ' + error.message)
          );
        })
      );
  }
  
  getUserName(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('name');
    }
    return null;
  }

  getUserId(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('userId');
    }
    return null;
  }

  logout(): void {
    
      
        sessionStorage.clear();
        window.location.reload();
      
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem('auth_token');
    }
    return false;
  }

  isAdmin(): boolean {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('role') === "ADMIN";
    }
    return false;
  }
}
