import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // For two-way binding
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  name: string = '';
  contactNumber: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.name && this.contactNumber && this.email && this.password) {
      const signupData = {
        name: this.name,
        contactNumber: this.contactNumber,
        email: this.email,
        password: this.password,
      };

      this.authService.signUp(signupData).subscribe(
        (response) => {
          console.log('Sign-up successful:', response);
          alert('Sign-up successful! Please log in.');
          this.router.navigate(['/login']); // Redirect to login page
        },
        (error) => {
          console.error('Sign-up failed', error);
          this.errorMessage = 'Sign-up failed. Please try again.';
          alert(this.errorMessage);
        }
      );
    } else {
      alert('Please fill in all the fields.');
    }
  }
}
