import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private baseUrl = `${environment.apiBaseUrl}user/`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post<any>(`${this.baseUrl}login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);

    // Decode the token and save the role
    const decodedToken = jwtHelper.decodeToken(token);
    if (decodedToken && decodedToken.role) {
      localStorage.setItem('role', decodedToken.role);
    }
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  signUp(data: { name: string; contactNumber: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}signup`, data);
  }
}
