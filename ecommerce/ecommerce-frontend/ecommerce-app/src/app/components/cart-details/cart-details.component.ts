import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number=0.00;
  totalQuantity: number=0;
  shippingCharges:number = 5;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails(){

    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = <number><unknown>(data + this.shippingCharges).toFixed(2)
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // to get the updated values of total quantity and product price.
    this.cartService.computeCartTotals();

  }

  incrementQuantity(theCartItem: CartItem){
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem){
    this.cartService.decrementQuantity(theCartItem);
  }

  removeItem(theCartItem: CartItem){
    this.cartService.removeCartItem(theCartItem);
  }

}
