import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// https://www.npmjs.com/package/libphonenumber-js
import parsePhoneNumber, {PhoneNumber, AsYouType} from "libphonenumber-js";

export default function phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const phoneNumber: PhoneNumber | undefined = parsePhoneNumber(control.value, "US");

        if (!phoneNumber || !phoneNumber?.isValid()) {
            return {invalidPhoneNumber: {value: control.value}};
        }
        
        return null;
    }
}