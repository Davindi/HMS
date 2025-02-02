import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { SideNavbarComponent } from '../components/side-navbar/side-navbar.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../services/appontment.service';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, MatIconModule, SideNavbarComponent, RouterModule,MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule, 
    FormsModule,
    HeaderComponent
  ],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss'
})
export class DoctorsComponent implements OnInit {

  isSidebarOpen: boolean = false;
  doctors: any[] = [];
  filteredDoctors: any[] = []; // Holds filtered data

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService // Inject AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadCachedDoctors();
    this.filterDoctorsBySpecialization();
  }

  toggleSidebar(state: boolean): void {
    this.isSidebarOpen = state;
  }

  loadCachedDoctors(): void {
    const cachedData = localStorage.getItem('publicDoctors');

    if (cachedData) {
      this.doctors = JSON.parse(cachedData); // Parse and use the data
      console.log('Doctors loaded from cache:', this.doctors);
    } else {
      console.warn('No cached doctor data found.');
    }
  }

  filterDoctorsBySpecialization(): void {
    this.route.params.subscribe((params) => {
      const specialization = params['specialization'];

      if (specialization) {
        // Filter based on specialization
        this.filteredDoctors = this.doctors.filter(
          (doctor) => doctor.specialization === specialization
        );
        console.log(
          `Filtered doctors for specialization (${specialization}):`,
          this.filteredDoctors
        );
      } else {
        // No specialization provided, show all doctors
        this.filteredDoctors = this.doctors;
      }
    });
  }


 

  appointment = {
    doctorName: '',
    date: null,
    session: ''
  };

  appointmentNumber: string | null = null;


  decodeToken(token: string): any {
    const payload = token.split('.')[1]; // Get the payload part of the token
    return JSON.parse(atob(payload)); // Decode from Base64 and parse JSON
  }

  bookAppointment(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to book an appointment.');
      return;
    }
  
    // Decode the token to extract the email
    const decodedToken = this.decodeToken(token);
    const userEmail = decodedToken?.sub; // Typically, the email is in the `sub` claim

    console.log('Extracted user email:', userEmail);

    if (!userEmail) {
      console.error('User email not found in token');
      alert('Invalid token. Please log in again.');
      return;
    }

    this.appointmentNumber = 'APPT-0000';
    
  
    if (this.appointment.doctorName && this.appointment.date && this.appointment.session) {
      const appointmentDetails = {
        ...this.appointment,
        userEmail: userEmail,
        appointmentNumber: this.appointmentNumber,
      };

      
  
      // Call the service to book the appointment
      this.appointmentService.addAppointment(appointmentDetails).subscribe(
        
        
        (response) => {
          console.log('Appointment booked:', response);
  
          const message = response?.message;
          if (message && message.includes('Appointment No:')) {
            const appointmentNumberMatch = message.match(/Appointment No:\s*(\d+)/);
            if (appointmentNumberMatch && appointmentNumberMatch[1]) {
              this.appointmentNumber = appointmentNumberMatch[1];
            } else {
              console.warn('Failed to extract appointment number from message.');
            }
          } else {
            console.warn('No appointment number found in response message. Using default value.');
          }
  
          // Show the alert after updating the appointmentNumber
          alert(`Appointment booked successfully! Your appointment number is: ${this.appointmentNumber}`);
        },
        (error) => {
          console.error('Failed to book appointment:', error);
          alert('Failed to book appointment. Please try again later.');
        }
      );
    }
  }
  
}