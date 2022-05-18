import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from 'src/app/common/customer';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OnlineShopValidators } from 'src/app/validators/online-shop-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  registerFormGroup: FormGroup = new FormGroup({});

  constructor(private authenticationService: AuthenticationService,
              private formbuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {

    this.registerFormGroup = this.formbuilder.group({
      
      customerRegister: this.formbuilder.group({
        firstName: new FormControl( '', 
                                    [ Validators.required, 
                                      Validators.minLength(2), 
                                      OnlineShopValidators.notOnlyWhitespace
                                    ]),
        lastName: new FormControl('',
                                    [ Validators.required, 
                                      Validators.minLength(2), 
                                      OnlineShopValidators.notOnlyWhitespace
                                    ]),
        email: new FormControl('', 
                                    [ Validators.required, 
                                      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                                    ]),

        password: new FormControl('',[ Validators.required,
                                       Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
                                    ]),

        phoneNumber: new FormControl('',[ Validators.required,
                                          Validators.pattern('[6-9]{1}[0-9]{9}')
                                    ])
      }),

    });
    
  }

  get firstName() { return this.registerFormGroup.get('customerRegister.firstName'); }
  get lastName() { return this.registerFormGroup.get('customerRegister.lastName'); }
  get email() { return this.registerFormGroup.get('customerRegister.email'); }
  get password() { return this.registerFormGroup.get('customerRegister.password'); }
  get phoneNumber() { return this.registerFormGroup.get('customerRegister.phoneNumber'); }



  onSubmit(){

    let customer: Customer = new Customer();

    if(this.registerFormGroup.invalid){
      
      // so that every field which is not filled correctly shows error on submission until they gets correct data filled.
      this.registerFormGroup.markAllAsTouched(); 
      return;
    }
   
    customer.email = this.email?.value;
    customer.firstName = this.firstName?.value;
    customer.lastName = this.lastName?.value;
    customer.password = this.password?.value;
    customer.phoneNumber = this.phoneNumber?.value;

    this.authenticationService.register(customer).subscribe(
      response => {
        this.router.navigate(['login']);
        console.log("Customer registered successfully");
      },
      error => {
        console.log("Customer registration unsuccessfull");
        alert("Email already registered!!");
        this.router.navigate(['products']);
      }
    );

  }

}
