import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private baseUrl = `${environment.apiBaseUrl}appointment/`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Get the token from local storage

    if (!token) {
      throw new Error('No authorization token found'); // Handle missing token
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add the token to the headers
      'Content-Type': 'application/json',
    });
  }


  // Add a new appointment
  addAppointment(appointment: any): Observable<any> {
    const headers = this.getAuthHeaders();

    console.log('Payload:', appointment);

    return this.http.post<any>(`${this.baseUrl}add`, appointment, { headers }).pipe(
      catchError((error) => {
        console.error('Error adding appointment:', error);
        return throwError(() => new Error('Failed to add appointment'));
      })
    );
  }

  getAppointments(): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.get<any>(`${this.baseUrl}get`, { headers }).pipe(
      map((response) => {
        console.log('Fetched appointments:', response);
        return response; // Process or map the response if needed
      }),
      catchError((error) => {
        console.error('Error fetching appointments:', error);
        return throwError(() => new Error('Failed to fetch appointments'));
      })
    );
  }

  getUpcomingAppointmentsList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}get`, { headers: this.getAuthHeaders() }).pipe(
      map((appointments) => {
        const today = new Date();
        return appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= today; // ✅ Only return future appointments
        });
      }),
      catchError((error) => {
        console.error('Error fetching upcoming appointments list:', error);
        return throwError(() => new Error('Failed to fetch upcoming appointments list'));
      })
    );
  }

  
  getUpcomingAppointmentCount(): Observable<number> {
    return this.getUpcomingAppointmentsList().pipe(
      map((appointments) => appointments.length), // ✅ Only return count
      catchError((error) => {
        console.error('Error fetching upcoming appointment count:', error);
        return throwError(() => new Error('Failed to fetch upcoming appointment count'));
      })
    );
  }
  

}
