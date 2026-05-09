import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import ProblemDetails from "../../Validation/problem-details";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: "root" })
export default class ErrorService {
    private readonly _snackBar = inject(MatSnackBar);

    handleHttpError(error: HttpErrorResponse): void {
        // the backend will return a ProblemDetails error object which Angular stores in the error property
        // For other errors, Angular will set this property to null if the error response did not contain a body
        const errorResponse: ProblemDetails | null = error.error;

        let errorMessage = "";
        switch (error.status) {
            case 401:
                errorMessage = `Unauthorized: ${error.status}`;
                break;
            case 409:
                errorMessage = "";
                break;
            default:
                errorMessage = `Unable to upload images at this time.`;
        }

        this._snackBar.open(errorResponse?.detail ?? errorMessage, "Descartar");
    }
}

