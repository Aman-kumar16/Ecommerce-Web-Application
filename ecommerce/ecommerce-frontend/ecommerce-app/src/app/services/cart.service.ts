import { Injectable } from '@angular/core';
import { BehaviorSubject,Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0); // initial value is 0
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem){

    //check if we already have the item in our cart.
    let inCart:boolean = false;
    let inCartItem:CartItem = theCartItem;

    // find the item in the cart based on item id.
    if(this.cartItems.length>0){

      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === theCartItem.id){
          inCart=true;
          inCartItem=tempCartItem;
          break;
        }
      }
      
    }
    
    // check if we found it.
    if(inCart){
      console.log("inside if of incart");
      inCartItem.quantity++;
      // console.log("inside in cart" + inCartItem.quantity);
    }else{
      this.cartItems.push(theCartItem);
    }

    // computing the total cart items and price.
    this.computeCartTotals();
  }

  decrementQuantity(theCartItem: CartItem) {

    //decrese the quantity of the product 
    theCartItem.quantity--;

    // if quantity becomes zero then remove the product from the cart items list.
    if(theCartItem.quantity === 0){
      this.removeCartItem(theCartItem);
    }

    this.computeCartTotals();    
  }

  // to remove the item from the cartItems array.
  removeCartItem(theCartItem: CartItem){

    const itemIndex = this.cartItems.findIndex( tempCartitem => tempCartitem.id === theCartItem.id );

    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  computeCartTotals(){

    let tempTotalPrice=0;
    let tempTotalQuantity=0;
    for(let tempCartItem of this.cartItems){
      tempTotalPrice += tempCartItem.price*tempCartItem.quantity;
      tempTotalQuantity += tempCartItem.quantity; 
      // console.log(tempTotalQuantity);
    }

    // to publish the new values next method is used.
    this.totalPrice.next(tempTotalPrice);
    this.totalQuantity.next(tempTotalQuantity);

    console.log("logging total price = "+ tempTotalPrice + "and total quantity = "+ tempTotalQuantity ); 
  }



}
