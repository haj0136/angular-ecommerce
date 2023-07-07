import { FormControl, ValidationErrors } from "@angular/forms";

export class InputValidators {

    // whitespace validation
    static notOnlyWhitespace(control: FormControl) : ValidationErrors {

        // check if string contains only whitespace
        if (control.value != null && control.value.trim().length === 0) {
            // invalid input => return error object
            return {'notOnlyWhitespace': true};
        }
        
        // valid input
        return null;
    }
}
