import {Component} from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  collapseNavbar(): void {
    const collapseBtn: HTMLElement | null = document.getElementById("navbarCollapseBtn");
    const collapseContainer: HTMLElement | null = document.getElementById("navbarCollapse");
    const isCollapseContainerShown: boolean | undefined = collapseContainer?.classList.contains("show");

    if (isCollapseContainerShown) {
      collapseBtn?.click();
    }
  }
}