import { FormControl, ValidationErrors } from "@angular/forms";

export class OnlineShopValidators {

    static notOnlyWhitespace(control: FormControl): ValidationErrors{

        // if string only contains whitespace then return validationError class object
        if( (control.value!=null) && (control.value.trim().length === 0)){
            
            // invalid, return error object
            return { 'notOnlyWhitespace': true }; // can be any name need not to be same as method name
        }else{
            // valid then return null;
            return <ValidationErrors><unknown> null;
        }
    }

}
