import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError , map} from 'rxjs/operators';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private baseUrl = `${environment.apiBaseUrl}doctor/`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Get the token from local storage

    if (!token) {
      throw new Error('No authorization token found'); // Handle missing token
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Add the token to the headers
      'Content-Type': 'application/json',
    });
  }

  getDoctors(): Observable<any[]> {
    const headers = this.getAuthHeaders();

    return this.http.get<any[]>(`${this.baseUrl}get`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching doctors:', error);
        return throwError(() => new Error('Failed to fetch doctors'));
      })
    );
  }

  addDoctor(doctor: any): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post<any>(`${this.baseUrl}add`, doctor, { headers }).pipe(
      catchError((error) => {
        console.error('Error adding doctor:', error);
        return throwError(() => new Error('Failed to add doctor'));
      })
    );
  }

  updateDoctor(doctor: any): Observable<any> {
    const headers = this.getAuthHeaders();

    console.log('Sending update request to:', `${this.baseUrl}update`);
    console.log('Payload:', doctor);

    return this.http.post<any>(`${this.baseUrl}update`, doctor, { headers }).pipe(
      catchError((error) => {
        console.error('Error updating doctor:', error);
        return throwError(() => new Error('Failed to update doctor'));
      })
    );
  }

  deleteDoctor(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}delete/${id}`, { headers, responseType: 'text' }).pipe(
      map((response) => {
        console.log('Delete response:', response);
        return response; // Return response as is
      }),
      catchError((error) => {
        console.error('Error deleting doctor:', error);
        return throwError(() => new Error('Failed to delete doctor'));
      })
    );
  }
  
}
