import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../components/header/header.component';
import { SideNavbarComponent } from '../components/side-navbar/side-navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, HeaderComponent, SideNavbarComponent, FormsModule],
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit {

  isSidebarOpen: boolean = false; // Sidebar state
  doctors: any[] = []; // List of doctors
  filteredDoctors: any[] = []; // Filtered list of doctors
  searchQuery: string = ''; // Search query
  errorMessage: string = ''; // Error message

  constructor(private appointmentService: DoctorService) {}

  toggleSidebar(state: boolean): void {
    this.isSidebarOpen = state;
  }


  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.appointmentService.getDoctors().subscribe(
      (data) => {
        this.doctors = data; // Assign fetched doctors
        this.filteredDoctors = data; 
      },
      (error) => {
        this.errorMessage = error.message; // Handle error
        console.error('Error fetching doctors:', error);
      }
    );
  }

  filterDoctors(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredDoctors = this.doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialization.toLowerCase().includes(query)
    );
  }
}

