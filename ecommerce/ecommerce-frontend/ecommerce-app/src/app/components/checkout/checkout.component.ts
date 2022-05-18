import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { OnlineShopFormService } from 'src/app/services/online-shop-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { OnlineShopValidators } from 'src/app/validators/online-shop-validators';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { AuthenticationService } from 'src/app/services/authentication.service';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  
  totalQuantity: number = 0;
  shippingCharges:number =5;
  totalPrice: number = 0;

  months: number[] = [];
  years: number[] = [];

  countries: Country[] = [];
  states: State[] = [];

  checkoutFormGroup: FormGroup= new FormGroup({});

  constructor(private onlineShopService: OnlineShopFormService, 
              private formbuilder: FormBuilder,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formbuilder.group({

      shippingAddress: this.formbuilder.group({
        street: new FormControl( '', 
              [ Validators.required, 
                Validators.minLength(2), 
                OnlineShopValidators.notOnlyWhitespace
              ]),

        city: new FormControl( '', 
              [ Validators.required, 
                Validators.minLength(2), 
                OnlineShopValidators.notOnlyWhitespace
              ]),

        state: new FormControl( '', [ Validators.required ]) ,
        
        country:  new FormControl( '', [ Validators.required ]),
        
        zipcode: new FormControl( '', 
                  [ Validators.required, 
                    Validators.pattern('[0-9]{6}'), 
                    OnlineShopValidators.notOnlyWhitespace
                  ]),
      }),

      creditCard: this.formbuilder.group({
        cardType: new FormControl( '', [ Validators.required ]) ,
        
        nameOnCard: new FormControl( '', 
                  [ Validators.required, 
                    Validators.minLength(2), 
                    OnlineShopValidators.notOnlyWhitespace
                  ]),
        
        cardNumber: new FormControl( '', [ Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl( '', [ Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl( '', [ Validators.required ]),
        expirationYear: new FormControl( '', [ Validators.required ])
      })
    });


    // call the services to prefill the card month and year.

    const startMonth: number = new Date().getMonth()+1;      // js month index from 0 so add 1 to it.
    console.log("start Month in card is : " + startMonth);
    
    this.onlineShopService.getCardMonths(startMonth).subscribe(
      data =>{
        console.log("Received card month: " + JSON.stringify(data));
        this.months = data;

        this.checkoutFormGroup.get('creditCard')?.get('expirationMonth')?.setValue(this.months[0]);
      }
    );

    this.onlineShopService.getCardYear().subscribe(
      data =>{
        console.log("Received card year: " + JSON.stringify(data));
        this.years = data;

        this.checkoutFormGroup.get('creditCard')?.get('expirationYear')?.setValue(this.years[0]);
      }
    );

    
    // get the countries.
    this.onlineShopService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data) );
        this.countries = data;
      }
    );

    // calling cart service for review order.
    this.getCartDetails();

    // if cart is empty then we cannot checkout
    if(this.totalQuantity===0){
      this.router.navigateByUrl("/products");
    }

  }

  //getters

  // for shipping
  get shippingStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingZipcode(){ return this.checkoutFormGroup.get('shippingAddress.zipcode'); }

  // for creditCard
  get cardType(){ return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get expirationMonth(){ return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get expirationYear(){ return this.checkoutFormGroup.get('creditCard.expirationYear'); }


  onSubmit(){
    console.log("submitting the checkout form now");

    console.log(this.checkoutFormGroup.invalid);
    if(this.checkoutFormGroup.invalid){
      
      // so that every field which is not filled correctly shows error on submission until they gets correct data filled.
      this.checkoutFormGroup.markAllAsTouched(); 
      return;
    }

    //logging basic form data
    console.log("The shipping address country is: " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping address state is: " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
    
    //set up order
    const order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    //mapping each cart item to orderItem
    const orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    const purchase: Purchase = new Purchase();

    // populate purchase - customer    
    purchase.customer = this.authenticationService.getLoggedInCustomer();
    
    // logging customer details
    console.log("purchase customer email : " + purchase.customer.email);
    console.log("purchase customer firstName" + purchase.customer.firstName);



    // populate purchase - shipping Address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the checkoutService it returns observable so subscribe it.
    this.checkoutService.placeOrder(purchase).subscribe(
      response => {
          alert("Thankyou for your Order. \n Your order tracking id is: " + response.orderTrackingNumber);

          this.resetCart();
        },error =>{
          alert("Order not placed error occured");
          this.router.navigateByUrl("/products");
        }
    );

  }

  // after completion of the order
  resetCart() {
  
    //reset cart data
    this.cartService.cartItems =[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form 
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");

  }

  // get the states based on the country in shipping Address.
  getStates(){

    const formGroup = this.checkoutFormGroup.get('shippingAddress');

    const countryCode =formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log('Shipping Address country code: ' + countryCode);
    console.log('Shipping Address country Name: ' + countryName);
    
    this.onlineShopService.getStates(countryCode).subscribe(
      data => {
        this.states = data;
        formGroup?.get('state')?.setValue(data[0]);
      }
    )

  }


  handleMonthsAndYears(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if current and selected year are equal then start with current month.

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.onlineShopService.getCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.months=data;
      }
    )

  }

  getCartDetails(){

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = <number><unknown>(data+this.shippingCharges).toFixed(2)
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )

  }

}
