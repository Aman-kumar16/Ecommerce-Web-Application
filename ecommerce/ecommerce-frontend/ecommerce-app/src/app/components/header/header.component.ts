import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedIn:boolean = false;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {

    this.loggedIn = this.authenticationService.isLoggedIn();

   this.authenticationService.loggedIn.subscribe(
    data =>{
      this.loggedIn = data;
    } 
   );
  }

  doSearch(searchText: string){
    console.log('searchText = '+ searchText);

    // we are calling this url to get the results
    this.router.navigateByUrl('/search/'+searchText);
  }

  logoutCustomer(){
    this.authenticationService.logout();
    this.loggedIn = false;
  }


}
