import { Component, OnInit } from '@angular/core';
import { GetResponseProducts, ProductService } from 'src/app/services/product.service';
import { CartService } from "src/app/services/cart.service";
import { Product } from 'src/app/common/product';
import { CartItem } from 'src/app/common/cart-item';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string;
  searchMode: boolean = false;

  // properties for pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  previousKeyword: string = null;

  constructor(private productService:ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.hadleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // if we have a different keyword than previous, then set page number to 1
    if (this.previousKeyword != theKeyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, pageNumber=${this.pageNumber}`);
    

    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.pageNumber - 1, this.pageSize, theKeyword)
      .subscribe(this.processResult());
  }

  hadleListProducts() {
    // check if 'id' parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the 'id' param string. Convert string to number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      // get "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }
    
    // Check if we have a different category than previous
    // NOTE: Angular will reuse a component if it is currently being viewed

    // if we have a different category id than previous then set page number back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.pageNumber}`);
    
    this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
    .subscribe(this.processResult())
  }

  processResult() {
    return (data: GetResponseProducts) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  };

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);
    
    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }

}
