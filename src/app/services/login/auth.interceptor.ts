import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { consumerAfterComputation } from '@angular/core/primitives/signals';


/* @Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (typeof window !== 'undefined') {
      const authToken = sessionStorage.getItem('token');
      if (authToken) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${authToken}`),
        });
        return next.handle(cloned);
      }
    }
    return next.handle(req);
  }
} */

  @Injectable({
    providedIn: 'root'
  })
export class AuthInterceptor implements HttpInterceptor{
  

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    
      //const token = sessionStorage.getItem("token");
      let token: string | null = null;

      console.log("Interceptor");
      console.log(typeof window);
     if (typeof window !== 'undefined') {
      token = sessionStorage.getItem('token');
    }
      //token = sessionStorage.getItem('token');
      let request = req;
      if(token){
        console.log("Token: " + token);
        request = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
            
          }
        });
      } 
        
          
        
        

      return next.handle(request).pipe(//Handle intercepta el request. Si hay token envia el req con el token sino el original - Pipe permite realizar el catchError y devolver el throwError
        catchError((err: HttpErrorResponse) =>{
          if(err.status === 401){//unauthorized
            this.router.navigateByUrl("/login");
          } else if(err.status === 403){//forbidden
            this.router.navigateByUrl("/login");
          }

          return throwError(err);

        })
      );
  }
}
