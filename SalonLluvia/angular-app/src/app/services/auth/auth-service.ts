import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { DestroyRef, inject, Injectable, OnInit, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import LoginModel from "../../models/login-model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import ProblemDetails from "../../Validation/problem-details";
import CurrentUser from "../../dto/account/current-user";
import ErrorService from "../error/error-service";
import NotificationService from "../notification/notification-service";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
    private _http = inject(HttpClient);
    private _router = inject(Router);
    private _destroyRef = inject(DestroyRef);
    private readonly _errorService = inject(ErrorService);
    private readonly _notificationService = inject(NotificationService);

    isAdmin = signal(false);
    isLoggedIn = signal(false);

    login(username: string, password: string, rememberMe: boolean): void {
        const url = "https://api.salonlluvia.com/account/login?useCookies=true";

        // const username = this.loginForm.value.username;
        // const password = this.loginForm.value.password;

        if (!(username || password)) {
            return;
        }

        const credentials: LoginModel = {
            username: username ?? "",
            password: password ?? "",
            rememberMe: rememberMe ?? false,
        };

        this._http.post<LoginModel>(url, credentials, { observe: "response", credentials: "include" })
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (response: HttpResponse<LoginModel>) => {
                    console.log(response);
                    console.log(`Login status code: ${response.status}`);

                    this.isLoggedIn.set(true);
                    this._notificationService.alert("Successful admin login!", 10_000);

                    this._router.navigateByUrl("/");
                },
                error: (error: HttpErrorResponse) => {
                    this._errorService.handleHttpError(error);
                },
                complete: () => {

                }
            }
            );
    }

    logout(): void {
        const url = "https://api.salonlluvia.com/account/logout";

        // https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-9.0#prerequisites:~:text=in%20this%20article.-,Log%20out,-To%20provide%20a
        this._http.post(url, {}, {
            credentials: "include",
            observe: "response",
        })
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: () => {
                    this.isLoggedIn.set(false);
                    this._notificationService.alert("Successfully logged out", 10_000);
                },
                error: (error: HttpErrorResponse) => {
                    this._errorService.handleHttpError(error);
                },
                complete: () => {

                }
            }
            );
    }

    fetchUser(): void {
        const url = "https://api.salonlluvia.com/account/me";

        console.log("fetching user...");
        this._http.get<CurrentUser>(url, {credentials: "include", observe: "response"})
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe({
                    next: (response: HttpResponse<CurrentUser>) => {
                        const user: CurrentUser | null = response.body; 

                        console.log(response);

                        this.isAdmin.set(user?.isAdmin ?? false);
                        this.isLoggedIn.set(user?.isLoggedIn ?? false);
                    },
                    error: () => {
                        // this will enter for most users since there is only one registered account
                        // so do nothing since this is really just to show the log in/out buttons in navbar
                        
                        // probs redundant since already false if this enters
                        this.isAdmin.set(false);
                        this.isLoggedIn.set(false);
                    },
                    complete: () => {

                    }
                });

    }
}