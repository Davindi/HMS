import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  updateSessionStatus(sessionId: number, status: string): Observable<any> {
    const statusMap = { status };
    return this.http.put<any>(`${this.baseUrl}update-status/${sessionId}`, statusMap, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error updating session status:', error);
        return throwError(() => new Error('Failed to update session status. Please try again later.'));
      })
    );
  }

  getUpcomingSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}get`, { headers: this.getAuthHeaders() }).pipe(
      map((sessions) => {
        const today = new Date();
        return sessions.filter(session => new Date(session.date) > today); // Only future sessions
      }),
      catchError((error) => {
        console.error('Error fetching upcoming sessions:', error);
        return throwError(() => new Error('Failed to fetch upcoming sessions.'));
      })
    );
  }

  // ✅ Get upcoming session count
  getUpcomingSessionCount(): Observable<number> {
    return this.getUpcomingSessions().pipe(
      map((sessions) => sessions.length),
      catchError((error) => {
        console.error('Error fetching upcoming session count:', error);
        return throwError(() => new Error('Failed to fetch upcoming session count.'));
      })
    );
  }

  
}

