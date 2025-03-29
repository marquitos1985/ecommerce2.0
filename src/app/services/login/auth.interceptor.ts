
import { catchError, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


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
  

  constructor(private router: Router, private cookieService: CookieService) { 
    //console.log("Interceptor!!!")
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log("Interceptor");
    
      //const token = sessionStorage.getItem("token");
      let token: string | null = null;

      /* console.log("Interceptor");
      console.log(typeof window);
      console.log(this.cookieService.get('token')); */
     /* if (typeof window !== 'undefined') {
      token = sessionStorage.getItem('token');
    } */
      token = this.cookieService.get('token');
      let request = req;
      if(token){
        //console.log("Token: " + token);
        request = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
            
          }
        });
      } 
        
          
        
        

      return next.handle(request).pipe(//Handle intercepta el request. Si hay token envia el req con el token sino el original - Pipe permite realizar el catchError y devolver el throwError
        catchError((err: HttpErrorResponse) =>{
          if(err.status === 401){//unauthorized
            console.log("unauthorized");
            this.cookieService.delete('email');
            this.router.navigateByUrl("/login");
          } else if(err.status === 403){//forbidden
            console.log("forbidden");
            
            this.router.navigateByUrl("/login");
            this.cookieService.delete('email');
          }

          return throwError(err);

        })
      );
  }
}
