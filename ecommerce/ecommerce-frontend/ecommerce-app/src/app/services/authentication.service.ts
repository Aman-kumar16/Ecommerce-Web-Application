import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Credentials } from '../common/credentials';
import { Customer } from '../common/customer';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
  customer: Customer = new Customer();

  loggedIn: Subject<boolean> = new BehaviorSubject<boolean>(false);

  baseUrl = "http://localhost:8082";

  constructor(private http: HttpClient) { }

  //generates token if credentials are valid
  generateToken(credentials: Credentials){
    
    return this.http.post(this.baseUrl + "/user/login", credentials);
  }

  loginCustomer(token:string){
    localStorage.setItem("token", token);
    this.isLoggedIn();
  }

  isLoggedIn(){
    let token = localStorage.getItem("token");
    if(token==undefined || token==='' || token==null){
      this.loggedIn.next(false);
      return false;
    }
    this.loggedIn.next(true);
    return true;
  }

  logout(){
    localStorage.removeItem("token");
    this.customer = new Customer();
  }

  getToken(){

    return localStorage.getItem("token");
  }

  // for registering the Customer
  register(customer: Customer){
    
    return this.http.post(this.baseUrl + "/user/register",customer);
  }

  getLoggedInCustomer(){
    return this.customer;
  }

  getCustomer(email: string){

    console.log("set Customer email received"+ email);
    return this.http.get(this.baseUrl + "/customers/search/findByEmail?email="+ email);
  }

  setCustomer(customer: Customer){

    this.customer.email = customer.email;
    this.customer.firstName = customer.firstName;
    this.customer.lastName = customer.lastName;
    this.customer.password = customer.password;
    this.customer.phoneNumber = customer.phoneNumber;

    console.log("set Customer email " + customer.email);
    console.log("set Customer firstName " + customer.firstName);
  }

}
