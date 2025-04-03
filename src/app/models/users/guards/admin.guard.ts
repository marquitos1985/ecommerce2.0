import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Role } from '../role';


@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  //private adminID = 'd1ef';

  constructor(private router: Router, private cookieService: CookieService) {}

  /* canActivate(): boolean {
    if (typeof window !== 'undefined') {
      const id = sessionStorage.getItem('id');
      if (id === this.adminID) {
        
        return true;
      }
    }
    this.router.navigate(['/']);
    return false;
  } */
    canActivate(): boolean {
      if (typeof window !== 'undefined') {
        const role = this.cookieService.get('role');
        if (role === Role.ADMIN) {
          
          return true;
        }
      }
      this.router.navigate(['/']);
      return false;
    }
}
