import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class OnlineShopFormService {

  private countriesUrl = "http://localhost:8082/countries";
  private statesUrl = "http://localhost:8082/states";


  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map( response => response._embedded.countries)
    );   
  }

  getStates(theCountryCode: string): Observable<State[]>{

    return this.httpClient.get<GetResponseStates>(this.statesUrl + "/search/findByCountryCode?code=" + theCountryCode).pipe(
      map( response => response._embedded.states)
    )
  }

  // get years and months for card details
  getCardMonths(startMonth:number): Observable<number[]>{

    let data: number[]=[];

    for(let tempMonth=startMonth; tempMonth<=12; tempMonth++){
      data.push(tempMonth);
    }

    return of(data);
  }

  getCardYear(): Observable<number[]>{

    let data: number[] = [];

    const startYear: number= new Date().getFullYear();
    const endYear: number=startYear+10;

    for(let tempYear=startYear; tempYear<=endYear; tempYear++){
      data.push(tempYear);
    }

    return of(data);
  }

}


interface GetResponseCountries{

  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}