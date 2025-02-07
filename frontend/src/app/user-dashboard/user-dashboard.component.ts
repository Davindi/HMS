import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideNavbarComponent } from '../components/side-navbar/side-navbar.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [RouterModule, 
            CommonModule,  
            SideNavbarComponent,  
            SlickCarouselModule,  
            MatToolbarModule, 
            MatIcon, 
            HeaderComponent
          ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent {
  isSidebarOpen: boolean = false;

  // This method accepts the emitted value
  toggleSidebar(state: boolean) {
    this.isSidebarOpen = state;
  }

  userName: string = 'John Doe'; // Replace with actual user data
  email: string = 'john.doe@example.com'; // Replace with user data
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('token'); // Clear user token
    this.router.navigate(['/login']); // Redirect to login page
  }

  images = [
    'assets/images/img4.webp',
    'assets/images/img2.webp',
    'assets/images/img3.webp',
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  };
}
