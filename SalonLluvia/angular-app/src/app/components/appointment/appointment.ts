import { Component, OnInit, signal, WritableSignal, Signal, ChangeDetectionStrategy, Injectable, inject, DestroyRef, computed } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl, Validators, ValueChangeEvent, ControlEvent, FormControlStatus } from "@angular/forms"
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

import phoneValidator from "../../Validation/Validators/phone.validator";
import parsePhoneNumber, { PhoneNumber } from "libphonenumber-js";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import AppointmentModel from "../../models/appointment-model";
import ProblemDetails from "../../Validation/problem-details";


@Component({
    selector: "appointment",
    imports: [ReactiveFormsModule, MatDatepickerModule, MatIconModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule],
    templateUrl: "./appointment.html",
    styleUrls: ["./appointment-core.css", "./appointment.css"],
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@Injectable({ providedIn: "root" })
export class Appointment implements OnInit {
    // #region properties
    appointmentForm = new FormGroup({
        name: new FormControl("", [Validators.required, Validators.maxLength(100)]),
        phoneNumber: new FormControl("", [Validators.required, Validators.maxLength(20), phoneValidator()]),
        email: new FormControl("", [Validators.required, Validators.maxLength(254), Validators.email]),
        date: new FormControl<Date | null>({ value: null, disabled: true }, Validators.required),
        desiredService: new FormControl("", [Validators.required, Validators.maxLength(200)])
    });

    private http = inject(HttpClient);
    private destroyRef = inject(DestroyRef);
    private _snackBar = inject(MatSnackBar);

    private availableDays: WritableSignal<Set<string>> = signal(new Set<string>());

    // Angular Material snackbar 
    private _snackBarHorizontalPos: MatSnackBarHorizontalPosition = "center";
    private _snackBarVerticalPos: MatSnackBarVerticalPosition = "bottom";
    private _actionText = "Dismiss";

    isFormSubmitting = signal(false);
    isDatepickerLoading = signal(this.appointmentForm.controls.date.status === "DISABLED");

    // used by Angular Material's datepicker to only enable days returned by Calendly API
    availableDaysFilter = (d: Date | null): boolean => {
        if (!d) {
            return false;
        }

        const day: string = d.toISOString().split("T")[0]; // backend returns ISO w/out time (T); "2026-05-07"

        return this.availableDays().has(day);
    };
    // #endregion

    constructor() {
        this.subscribeToPhoneNumberStatusChanges();
    }

    // #region methods
    ngOnInit(): void {
        this.fetchAvailableDays();
    }

    private fetchAvailableDays(): void {
        const url = "https://api.salonlluvia.com/calendly/available-days";

        console.log(`Date FormControl: ${this.appointmentForm.controls.date}`)
        console.log(`Date FormControl value: ${this.appointmentForm.value.date}`)
        console.log(`Date FormControl status: ${this.appointmentForm.controls.date.status}`)

        this.http.get<Array<string>>(url)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (availableDays: Array<string>) => {
                    console.log(availableDays);

                    this.availableDays.set(new Set<string>(availableDays));
                },
                error: (error: HttpErrorResponse) => {
                    console.log(error);
                },
                complete: () => {
                    console.log("Enabling date picker");
                    this.appointmentForm.controls.date.enable();
                    this.isDatepickerLoading.set(false);

                    console.log(`Is datepicker loading? ${this.isDatepickerLoading()}`)
                }
            });
    }

    private subscribeToPhoneNumberStatusChanges() {
        const phoneNumberControl: FormControl = this.appointmentForm.controls.phoneNumber;

        phoneNumberControl.statusChanges.subscribe((status: FormControlStatus) => {
            const phoneNumber: PhoneNumber | undefined = parsePhoneNumber(phoneNumberControl.value, "US");

            if (!phoneNumber || !phoneNumber?.isValid()) {
                return;
            }

            switch (status) {
                case "VALID":
                    const formattedPhoneNumber: string = phoneNumber.formatNational();
                    phoneNumberControl.setValue(formattedPhoneNumber, { emitEvent: false })
                    break;
            }
        });
    }

    submitAppointment() {
        const url = "https://api.salonlluvia.com/calendly/appointment";

        let date = this.appointmentForm.value.date;
        if (!date) {
            return;
        }

        this.isFormSubmitting.set(true);

        const appointmentModel: AppointmentModel = {
            name: this.appointmentForm.value.name ?? "",
            phoneNumber: this.appointmentForm.value.phoneNumber ?? "",
            email: this.appointmentForm.value.email ?? "",
            date: date.toISOString().split("T")[0], // backend doesn't use time part since the time a salon's service takes varies from person-to-person and isn't worth calculating
            desiredService: this.appointmentForm.value.desiredService ?? ""
        };

        this.http.post<AppointmentModel>(url, appointmentModel)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                console.log("Successfully booked appointment!");
            },
            error: (error: HttpErrorResponse) => {
                console.log("unable to book appointment :(");
                console.log(error);
                const errorResponse: ProblemDetails = error.error;
                this._snackBar.open(errorResponse.detail, this._actionText, {
                    horizontalPosition: this._snackBarHorizontalPos,
                    verticalPosition: this._snackBarVerticalPos
                });

                this.isFormSubmitting.set(false);
            },
            complete: () => {
                this.isFormSubmitting.set(false);
            }
        });

        console.log("submitting appointment");
    }

    // #endregion
}