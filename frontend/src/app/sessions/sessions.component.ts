import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '../services/session.service';
import { SideNavbarComponent } from '../components/side-navbar/side-navbar.component';
import { HeaderComponent } from '../components/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SideNavbarComponent, HeaderComponent, RouterModule],
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {

  isSidebarOpen: boolean = false;

  // This method accepts the emitted value
  toggleSidebar(state: boolean) {
    this.isSidebarOpen = state;
  }

  sessions: any[] = [];
  doctors: any[] = []; 
  sessionForm: FormGroup;
  isLoading = false;

  sessionOptions: string[] = ['Morning', 'Afternoon', 'Evening'];

  constructor(private sessionService: SessionService, private fb: FormBuilder) {
    this.sessionForm = this.fb.group({
      doctorName: ['', Validators.required],
      date: ['', Validators.required],
      session: ['', Validators.required],
      status: ['Active', Validators.required],
    });
  }

  ngOnInit() {
    this.loadCachedDoctors();
    this.loadSessions();
  }

  loadCachedDoctors() {
    const cachedData = localStorage.getItem('publicDoctors');
    if (cachedData) {
      this.doctors = JSON.parse(cachedData);
      console.log('Doctors loaded from cache:', this.doctors);
    } else {
      console.warn('No cached doctor data found.');
    }
  }

  loadSessions() {
    this.isLoading = true;
    this.sessionService.getSessions().subscribe({
      next: (data) => {
        this.sessions = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching sessions:', error);
        this.isLoading = false;
      },
    });
  }

  addSession() {
    if (this.sessionForm.valid) {
      this.sessionService.addSession(this.sessionForm.value).subscribe({
        next: () => {
          this.loadSessions();
          this.sessionForm.reset();
        },
        error: (error) => console.error('Error adding session:', error),
      });
    }
  }

  // Toggle session status
  toggleSessionStatus(session: any) {
    const updatedStatus = session.status === 'Active' ? 'Cancelled' : 'Active';
    this.sessionService.updateSessionStatus(session.id, updatedStatus).subscribe({
      next: (response) => {
        console.log('Session status updated:', response);
        this.loadSessions(); // Reload sessions after status change
      },
      error: (err) => {
        console.error('Error updating session status:', err);
      },
    });
  }
  
}
