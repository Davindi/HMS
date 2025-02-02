import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private baseUrl = `${environment.apiBaseUrl}session/`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token found');
      throw new Error('No authorization token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}get`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching sessions:', error);
        return throwError(() => new Error('Failed to fetch sessions. Please try again later.'));
      })
    );
  }

  addSession(session: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}add`, session, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error adding session:', error);
        return throwError(() => new Error('Failed to add session. Please check your input.'));
      })
    );
  }

  
}

