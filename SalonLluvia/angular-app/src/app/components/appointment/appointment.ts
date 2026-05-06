import { Component, OnInit, signal, WritableSignal, ChangeDetectionStrategy } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl, Validators, ValueChangeEvent, ControlEvent, FormControlStatus } from "@angular/forms"
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';

import phoneValidator from "../../Validation/Validators/phone.validator";
import parsePhoneNumber, { PhoneNumber } from "libphonenumber-js";

@Component({
    selector: "appointment",
    imports: [ReactiveFormsModule, MatDatepickerModule, MatIconModule, MatInputModule, MatFormFieldModule],
    templateUrl: "./appointment.html",
    styleUrls: ["./appointment-core.css", "./appointment.css"],
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Appointment implements OnInit {
    appointmentForm = new FormGroup({
        name: new FormControl("", Validators.required),
        phone: new FormControl("", [Validators.required, phoneValidator()]),
        email: new FormControl("", [Validators.required, Validators.email]),
        date: new FormControl("", Validators.required),
        desiredService: new FormControl("")
    });

    availableDays: WritableSignal<string[]> = signal(new Array<string>());

    async ngOnInit(): Promise<void> {
        this.availableDays.set(await this.fetchAvailableDays());


    }

    private async fetchAvailableDays(): Promise<string[]> {
        return ["test"];
    }

    constructor() {
        this.subscribeToPhoneNumberStatusChanges();
    }
    

    private subscribeToPhoneNumberStatusChanges() {
        const phoneNumberControl: FormControl = this.appointmentForm.controls.phone;

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

    handleSubmit() {
        console.log("handling submission");
    }
}