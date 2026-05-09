import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthenticationService } from "../../services/auth/auth-service";
import { MatDialog } from "@angular/material/dialog";
import { ImageUploadContentDialog } from "../gallery/image-upload-content-dialog";

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  _authService = inject(AuthenticationService);
  private readonly _dialog = inject(MatDialog);

  collapseNavbar(): void {
    const collapseBtn: HTMLElement | null = document.getElementById("navbarCollapseBtn");
    const collapseContainer: HTMLElement | null = document.getElementById("navbarCollapse");
    const isCollapseContainerShown: boolean | undefined = collapseContainer?.classList.contains("show");

    if (isCollapseContainerShown) {
      collapseBtn?.click();
    }
  }

  logout(): void {
    this._authService.logout();
  }

  openImageUploadDialog(): void {
    const dialogRef = this._dialog.open(ImageUploadContentDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}