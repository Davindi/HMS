import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideNavbarComponent } from '../components/side-navbar/side-navbar.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, SideNavbarComponent, HeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  isSidebarOpen: boolean = false;

  // This method accepts the emitted value
  toggleSidebar(state: boolean) {
    this.isSidebarOpen = state;
  }

 
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('token'); // Clear user token
    this.router.navigate(['/login']); // Redirect to login page
  }

}
