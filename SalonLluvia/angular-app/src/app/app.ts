import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { AuthenticationService } from './services/auth/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('angular-app');
  
  authService = inject(AuthenticationService);
  
  ngOnInit(): void {
    // navbar.html & gallery.html read the isAdmin & isLoggedIn signals this initializes
    // this component will initially have the home page so might as well initialize from the start
    this.authService.fetchUser();
  }
}
