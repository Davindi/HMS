import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog'; // Keep this import here for dialog service
import { SideNavbarComponent } from '../components/side-navbar/side-navbar.component';
import { AddDoctorDialogComponent } from '../add-doctor-dialog/add-doctor-dialog.component';
import { DoctorService } from '../services/doctor.service';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-manage-doctors',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    SideNavbarComponent,
    MatIconModule,
    HeaderComponent,
  ],
  templateUrl: './manage-doctors.component.html',
  styleUrls: ['./manage-doctors.component.scss'],
})

export class ManageDoctorsComponent implements OnInit {
  isSidebarOpen: boolean = false;
  //isFormVisible: boolean = false; // Added this for form visibility
  addDoctorForm!: FormGroup; // FormGroup for the Add Doctor form
  doctors: any[] = [];

  constructor(
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private fb: FormBuilder // Added FormBuilder for form creation
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    //this.initializeForm(); // Initialize the form
  }

  toggleSidebar(state: boolean): void {
    this.isSidebarOpen = state;
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        // Save data to localStorage for user access
        localStorage.setItem('publicDoctors', JSON.stringify(data));
        console.log('Doctors cached in localStorage:', data);
      },
      error: (err) => {
        console.error('Error fetching doctors:', err);
      },
    });
  }

  openAddDoctorDialog(): void {
    const dialogRef = this.dialog.open(AddDoctorDialogComponent, {
      width: '500px',
      data: { title: 'Add Doctor' }, // You can pass additional data to the dialog
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Assuming result contains the new doctor's data
        this.doctorService.addDoctor(result).subscribe(
          (response) => {
            console.log('New doctor added:', response);
            this.loadDoctors(); // Reload the list of doctors
          },
          (error) => {
            console.error('Error adding doctor:', error);
          }
        );
      }
    });
  }

  openUpdateDoctorDialog(doctorToUpdate: any): void {
    const dialogRef = this.dialog.open(AddDoctorDialogComponent, {
      width: '500px',
      data: { title: 'Update Doctor', doctor: doctorToUpdate }, // Pass the existing doctor data to pre-fill the form
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //console.log('Updated Doctor:', updatedDoctor);
        const updatedDoctor = { ...result, id: doctorToUpdate.id };
        this.doctorService.updateDoctor(updatedDoctor).subscribe(
          (response) => {
            console.log('Doctor updated:', response);
            this.loadDoctors(); // Reload doctors
          },
          (error) => {
            console.error('Error updating doctor:', error);
          }
        );
      }
    });
  }


  
  deleteDoctor(doctor: any): void {
    if (confirm(`Are you sure you want to delete Doctor ${doctor.name}?`)) {
      this.doctorService.deleteDoctor(doctor.id).subscribe(
        (response) => {
          console.log('Doctor deleted successfully:', response);
          this.loadDoctors(); // Reload the list of doctors
        },
        (error) => {
          console.error('Error deleting doctor:', error);
          alert('Failed to delete doctor. Please try again later.');
        }
      );
    }
  }
}
