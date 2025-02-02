import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule], // Import RouterModule for navigation links
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
})
export class SideNavbarComponent {
  isOpen: boolean = false; // Controls the visibility of the navigation bar
  userRole: string = ''; 

  @Output() sidebarToggle = new EventEmitter<boolean>();

  constructor() {
    this.userRole = localStorage.getItem('role') || 'user';  // Fetch the role (default to 'user' if not set)
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;  // Toggle the sidebar state
    this.sidebarToggle.emit(this.isOpen); // Emit the updated state to the parent
  }

  menuItems = [
    { label: 'Dashboard', path: '/userdashboard' , icon: 'dashboard'},
    { label: 'My Appointments', path: '/appointments' ,icon: 'event'},
    { label: 'All Doctors', path: '/alldoctors' ,icon: 'person'},
    { label: 'Logout', path: '/login' , icon: 'logout', action: 'logout'},
  ];

  getMenuItems() {
    if (this.userRole === 'admin') {
      return [
        { label: 'Dashboard', path: '/admindashboard' , icon: 'dashboard' },
        { label: 'Manage Doctors', path: '/managedoctors' ,icon: 'group'},
        { label: 'Manage Sessions', path: '/sessions' ,icon: 'access_time'},
        { label: 'Settings', path: '/settings'  },
        { label: 'Logout', path: '/login' , icon: 'logout', action: 'logout'},
      ];
    }
    return this.menuItems;  // Default for user
  }

  logout() {
    localStorage.removeItem('token'); // Clear all stored user data
    this.isOpen = false; // Close the sidebar
    window.location.href = '/login'; // Redirect to the login page
  }
}

