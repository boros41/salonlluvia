import { Component } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl, Validators, ValueChangeEvent, ControlEvent, FormControlStatus } from "@angular/forms"

import phoneValidator from "../../Validation/Validators/phone.validator";
import parsePhoneNumber, { AsYouType, PhoneNumber } from "libphonenumber-js";

@Component({
    selector: "appointment",
    imports: [ReactiveFormsModule],
    templateUrl: "./appointment.html",
    styleUrls: ["./appointment-core.css", "./appointment.css"]
})
export class Appointment {
    appointmentForm = new FormGroup({
        name: new FormControl("", Validators.required),
        phone: new FormControl("", [Validators.required, phoneValidator()]),
        email: new FormControl("", [Validators.required, Validators.email]),
        date: new FormControl(""),
        desiredService: new FormControl("")
    });

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