import { Component , OnInit} from '@angular/core';
import { SideNavbarComponent } from '../components/side-navbar/side-navbar.component';
import { HeaderComponent } from '../components/header/header.component';
import { AppointmentService } from '../services/appontment.service';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-now',
  standalone: true,
  imports: [SideNavbarComponent, HeaderComponent, RouterModule, FormsModule, CommonModule],
  templateUrl: './book-now.component.html',
  styleUrl: './book-now.component.scss'
})
export class BookNowComponent implements OnInit {

  isSidebarOpen: boolean = false;

  // This method accepts the emitted value
  toggleSidebar(state: boolean) {
    this.isSidebarOpen = state;
  }


  
    doctors: any[] = [];
  
    constructor(
      private route: ActivatedRoute,
      private appointmentService: AppointmentService // Inject AppointmentService
    ) {}



  
    ngOnInit(): void {
      this.loadCachedDoctors();
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
