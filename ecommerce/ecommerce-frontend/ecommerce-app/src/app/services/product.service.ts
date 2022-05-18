import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private baseUrl = "http://localhost:8082/products"; 

  private categoryUrl = "http://localhost:8082/product-category";


  constructor(private httpClient: HttpClient) { }


  // get the product with given id.
  getProduct(theProductId: number): Observable<Product>{

    const productUrl = this.baseUrl+'/'+theProductId;

    return this.httpClient.get<Product>(productUrl);
  }

  // returns all the products with pagination.
  getAllProductListPaginate(pageNumber:number, pageSize:number): Observable<GetResponseProducts>{
    
    const searchUrl = this.baseUrl + "?page=" + pageNumber + "&size="+pageSize; 
    
    return this.getProducts(searchUrl);
  }

  // returns all the products of given category with certain pagenumber
  getProductListPaginate(pageNum: number,
                          pageSize: number,
                          theCategoryId: number): Observable<GetResponseProducts>{
    
    // url based on the  category id, page and size.
    const searchUrl = this.baseUrl+"/search/findByCategoryId?id="+theCategoryId
                      +"&page="+pageNum+"&size="+pageSize;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(pageNumber: number, pageSize: number, searchText: string) {

    const searchUrl=this.baseUrl + "/search/findByNameContaining?name="+searchText +
                    "&page="+pageNumber+"&size="+pageSize;

    return this.getProducts(searchUrl);                
  }

  //utility function to get data from the url passed
  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  // for the menu bar
  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  

}


// we are specifying the response type here so that it doesn't give error
interface GetResponseProducts{
  _embedded: { 
    products: Product[];
  },

  page:{
    size: number,
    totalElements: number,
    totalPages: number,
    number: number,
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[]; 
  }
}
