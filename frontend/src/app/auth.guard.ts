import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
  
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token
      const isExpired = payload.exp < Date.now() / 1000; // Check expiry
  
      if (!isExpired) {
        return true;
      } else {
        alert('Session expired. Please log in again.');
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
