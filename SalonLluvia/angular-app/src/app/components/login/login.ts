import { HttpClient, HttpErrorResponse, HttpParamsOptions, HttpResponse } from "@angular/common/http";
import { Component, DestroyRef, inject, Injectable } from "@angular/core";
import { ReactiveFormsModule, FormControl, FormGroup, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import LoginModel from "../../models/login-model";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import ProblemDetails from "../../Validation/problem-details";
import { MatSnackBar } from "@angular/material/snack-bar";

import { AuthenticationService } from "../../services/auth/auth-service";

@Component({
    selector: "gallery",
    imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, RouterLink],
    templateUrl: "./login.html",
    styleUrl: "./login.css",
})
@Injectable({ providedIn: "root" })
export class Login {
    loginForm = new FormGroup({
        username: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
        password: new FormControl("", [Validators.required, Validators.maxLength(255)]),
        rememberMe: new FormControl(false)
    });

    private _authService = inject(AuthenticationService);

    login(): void {
        const username = this.loginForm.value.username ?? "";
        const password = this.loginForm.value.password ?? "";
        const rememberMe = this.loginForm.value.rememberMe ?? false;

        this._authService.login(username, password, rememberMe);
    }
}