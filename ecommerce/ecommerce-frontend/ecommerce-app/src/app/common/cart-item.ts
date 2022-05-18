import { Product } from "./product";

export class CartItem {
    
    id: number=-1;
    name: string="";
    imageUrl: string="";
    price: number=0;
    quantity:number=0;

    constructor(product: Product){
        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.price = product.price;
        this.quantity = 1;
    }
}
