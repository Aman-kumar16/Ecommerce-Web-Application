import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import {Product} from '../../common/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = -1;  // by default its -1.
  previousCategoryId: number =-1;
  searchMode: boolean = false;
  searchText: string="";
  previousSearchText: string ="";

  // properties for pagination with default values
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( ()=> {
      this.listProducts();
    } )
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }

  }

  handleSearchProducts(){
    
    this.searchText= <string>this.route.snapshot.paramMap.get('keyword');
    if(this.searchText!=this.previousSearchText){
      this.thePageNumber=1;
    }

    this.previousSearchText=this.searchText;
    
    console.log("searchText = " + this.searchText);

    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                                this.thePageSize,
                                                this.searchText).subscribe(this.processResult());

  }


  handleListProducts(){
    
    //check if the "id" parameter is available
    const hasCategoryId: boolean=this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      
      //get the "id" param string. convert string to a number if null then take default
      const temp = <unknown>this.route.snapshot.paramMap.get('id');
      if(temp!=null){
        this.currentCategoryId = <number>temp;
      }

      
      // check if we have different category thean previous. if yes then display the first page.
      if(this.previousCategoryId != this.currentCategoryId){
        this.thePageNumber=1;
      }

      this.previousCategoryId = this.currentCategoryId;

    }


    // to get all the products if category id is not specified.
    if(this.currentCategoryId==-1){

      console.log("List all Products page Number = "+this.thePageNumber );

      this.productService.getAllProductListPaginate( this.thePageNumber-1 ,this.thePageSize).subscribe(this.processResult());
    }
    else{ // if any catoegory has been selected.

      console.log("current Category Id = "+this.currentCategoryId + " page Number = "+this.thePageNumber );

      // get the products with given category id with pagination.
      this.productService.getProductListPaginate(this.thePageNumber-1,  // spring api will return the page number starting from 0.
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(this.processResult());
      
    }
  }

  //utility function for getting the products information and mapping it to local variables.
  processResult(){

    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) =>{
      this.products=data._embedded.products;
      this.thePageNumber = data.page.number+1;    // angular takes page number starting from 1.
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: string){

    console.log("pageSizechanged to: "+ pageSize);
    this.thePageSize = +pageSize;
    this.thePageNumber=1;
    this.listProducts();
  }

  addToCart(tempProduct: Product){

    console.log("Adding to cart" + tempProduct.name + "having id" + tempProduct.id);
    
    const theCartItem = new CartItem(tempProduct);

    this.cartService.addToCart(theCartItem);
  }

}
