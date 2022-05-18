export class Product {

    id: number=-1;
    sku: string = "";
    name: string = "";
    description: string = "";
    price: number = 0;
    imageUrl: string = "";
    active: boolean = false;
    stock: number = 0;
    dateCreated: Date = new Date();
    lastUpdated: Date = new Date() ;

}