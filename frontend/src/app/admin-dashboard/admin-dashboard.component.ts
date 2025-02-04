import { Component , OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideNavbarComponent } from '../components/side-navbar/side-navbar.component';
import { HeaderComponent } from '../components/header/header.component';
import { DoctorService } from '../services/doctor.service';
import { AppointmentService } from '../services/appontment.service'; 
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, SideNavbarComponent, HeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit{
  isSidebarOpen: boolean = false;

  // This method accepts the emitted value
  toggleSidebar(state: boolean) {
    this.isSidebarOpen = state;
  }

 
  constructor(private router: Router, 
    private doctorService: DoctorService,
    private appointmentService: AppointmentService, 
    private sessionService: SessionService) {}

  logout(): void {
    localStorage.removeItem('token'); // Clear user token
    this.router.navigate(['/login']); // Redirect to login page
  }


  doctorCount: number = 0;
  upcomingAppointmentCount: number = 0;
  upcomingSessionCount: number = 0;
  upcomingAppointments: any[] = [];
  upcomingSessions: any[] = []; 


  ngOnInit(): void {
    this.loadDoctors();
    this.fetchUpcomingAppointments();
    this.fetchUpcomingAppointmentCount();
    this.fetchUpcomingSessions();
    this.fetchUpcomingSessionCount();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (doctors) => {
        this.doctorCount = doctors.length; // Count doctors from the response
      },
      (error) => {
        console.error('Error loading doctors:', error);
      }
    );
  }

  fetchUpcomingAppointmentCount() {
    this.appointmentService.getUpcomingAppointmentCount().subscribe({
      next: (count) => this.upcomingAppointmentCount = count,
      error: (error) => console.error('Error fetching upcoming appointment count:', error)
    });
  }

  fetchUpcomingAppointments() {
    this.appointmentService.getUpcomingAppointmentsList().subscribe({
      next: (appointments) => this.upcomingAppointments = appointments,
      error: (error) => console.error('Error fetching upcoming appointments:', error)
    });
  }


  fetchUpcomingSessions() {
    this.sessionService.getUpcomingSessions().subscribe({
      next: (sessions) => this.upcomingSessions = sessions,
      error: (error) => console.error('Error fetching upcoming sessions:', error)
    });
  }

  fetchUpcomingSessionCount() {
    this.sessionService.getUpcomingSessionCount().subscribe({
      next: (count) => this.upcomingSessionCount = count,
      error: (error) => console.error('Error fetching upcoming session count:', error)
    });
  }

}
