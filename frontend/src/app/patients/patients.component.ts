import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appontment.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { SideNavbarComponent } from '../components/side-navbar/side-navbar.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SideNavbarComponent],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})

export class PatientsComponent implements OnInit {

  isSidebarOpen: boolean = false;

  toggleSidebar(state: boolean): void {
    this.isSidebarOpen = state;
  }
  
  appointments: any[] = []; // Store the fetched appointments

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.fetchAppointments(); // Load appointments on init
  }

  fetchAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
      (data) => {
        this.appointments = data;
        console.log('Appointments loaded:', this.appointments);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
}

