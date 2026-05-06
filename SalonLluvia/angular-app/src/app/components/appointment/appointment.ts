import { Component } from "@angular/core";
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from "@angular/forms"

@Component({
    selector: "appointment",
    imports: [ReactiveFormsModule],
    templateUrl: "./appointment.html",
    styleUrls: ["./appointment-core.css", "./appointment.css"]
})
export class Appointment {
    appointmentForm = new FormGroup({
        name: new FormControl("", Validators.required),
        phone: new FormControl(""),
        email: new FormControl(""),
        date: new FormControl(""),
        desiredService: new FormControl("")
    });

    handleSubmit() {
        console.log("handling submission");
    }
}