import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Credentials } from 'src/app/common/credentials';
import { Customer } from 'src/app/common/customer';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  customer: Customer = new Customer();
  isLoggedIn: boolean = false;
  loginFormGroup: FormGroup= new FormGroup({});
  invalidCredentials:boolean = false;

  constructor(private formbuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {

    this.loginFormGroup = this.formbuilder.group({
      
      customerLogin: this.formbuilder.group({
        email: new FormControl('', 
                                    [ Validators.required, 
                                      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                                    ]),

        password: new FormControl('',[ Validators.required,
                                       Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
                                    ])
      }),

    });

  }

  // getter for customer-login
  get email() { return this.loginFormGroup.get('customerLogin.email'); }
  get password(){ return this.loginFormGroup.get('customerLogin.password'); }

  onSubmit(){
    console.log("submitting the login credentials");

    if(this.loginFormGroup.invalid){
      
      // so that every field which is not filled correctly shows error on submission until they gets correct data filled.
      this.loginFormGroup.markAllAsTouched(); 
      return;
    }
    
    //email and password are of valid form thus check for login
    let credentials : Credentials = new Credentials();

    credentials.email = this.email?.value;
    credentials.password = this.password?.value;

    this.authenticationService.generateToken(credentials).subscribe(
      (response:any) =>{
        //success
        console.log(response.token);
        this.authenticationService.loginCustomer(response.token);
        
        this.router.navigate(['products']);
        this.invalidCredentials = false;
        
        console.log("login successfull");
      },
      error=>{
        this.invalidCredentials = true;
        console.log("token not generated exception occured");
      }
    )

    this.delay(3000).then(
      any =>{
        this.isLoggedIn = this.authenticationService.isLoggedIn();
        console.log("Is customer logged in " + this.isLoggedIn);
        if(this.isLoggedIn){
          this.getCustomerInfo(credentials.email);
        }
      }
    );

  }


  getCustomerInfo(email: string){
    this.authenticationService.getCustomer(email).subscribe(
      (response:any) => {
        console.log("response email is " + response.email);
        this.customer.email = response.email;
        this.customer.firstName = response.firstName;
        this.customer.lastName = response.lastName;
        this.customer.password = response.password;
        this.customer.phoneNumber = response.phoneNumber;
        console.log("response email in customer object is " + this.customer.email);

        this.authenticationService.setCustomer(this.customer);
      },error =>{
        console.log("error occured while getting customer");
      }
      
    );
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
}

}
