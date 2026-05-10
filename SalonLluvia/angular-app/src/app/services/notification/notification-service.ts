import { inject, Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

@Injectable({providedIn: "root"})
export default class NotificationService {
    private readonly _snackBar = inject(MatSnackBar);

    alert(
        message: string,
        duration?: number,
        posHorizontal: MatSnackBarHorizontalPosition = "center",
        posVertical: MatSnackBarVerticalPosition = "bottom"
    ): void {
        const config: MatSnackBarConfig = {
            horizontalPosition: posHorizontal,
            verticalPosition: posVertical,
            duration: duration
        };

        this._snackBar.open(message, "Descartar", config);
    }
}