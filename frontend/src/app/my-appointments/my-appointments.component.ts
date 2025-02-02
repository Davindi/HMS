import { Component , OnInit} from '@angular/core';
import { AppointmentService } from '../services/appontment.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { SideNavbarComponent } from '../components/side-navbar/side-navbar.component';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SideNavbarComponent],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.scss'
})
export class MyAppointmentsComponent implements OnInit {

  isSidebarOpen: boolean = false;

  toggleSidebar(state: boolean): void {
    this.isSidebarOpen = state;
  }

  upcomingAppointments: any[] = [];
  pastAppointments: any[] = [];
  errorMessage: string = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
      (data) => {
        const currentDate = new Date();

        // Split appointments into upcoming and past
        this.upcomingAppointments = data.filter((appointment: any) =>
          new Date(appointment.date) > currentDate
        );

        this.pastAppointments = data.filter((appointment: any) =>
          new Date(appointment.date) <= currentDate
        );
      },
      (error) => {
        this.errorMessage = error.message; // Handle any errors
        console.error('Error fetching appointments:', error);
      }
    );
  }

}
