import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  sessions: any[] = [];
  sessionForm: FormGroup;
  isLoading = false;

  constructor(private sessionService: SessionService, private fb: FormBuilder) {
    this.sessionForm = this.fb.group({
      doctorName: ['', Validators.required],
      date: ['', Validators.required],
      session: ['', Validators.required],
      status: ['Active', Validators.required],
    });
  }

  ngOnInit() {
    this.loadSessions();
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

  
}
