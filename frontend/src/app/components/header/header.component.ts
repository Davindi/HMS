import { Component , EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SideNavbarComponent } from '../side-navbar/side-navbar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIcon, MatToolbarModule, SideNavbarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Output() sidebarToggle = new EventEmitter<boolean>();

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggle.emit(this.isSidebarOpen);
  }

  

  
}
