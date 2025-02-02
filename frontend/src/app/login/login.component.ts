import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // For two-way binding (if needed)
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // Standalone component
  imports: [FormsModule, RouterModule, CommonModule], // Import any dependencies (if necessary)
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        if (response && response.token) {
          console.log('Login successful! Token:', response.token);
          //localStorage.setItem('token', response.token); // Store token
          //localStorage.setItem('role', response.role);

          this.authService.saveToken(response.token); // Save token and role

          const role = this.authService.getRole();

          if (role === 'admin') {
            this.router.navigate(['/admindashboard']); // Admin route
          } else {
            this.router.navigate(['/userdashboard']); // User route
          }
        } else {
          this.errorMessage = 'No token received.';
        }
      },
      (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    );
  }
}



