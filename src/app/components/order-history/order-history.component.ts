import { Component, OnInit } from '@angular/core';

import { Constants } from "../../common/constants";
import { OrderHistory } from "../../common/order-history";
import { OrderHistoryService } from "../../services/order-history.service";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const email = this.storage.getItem(Constants.USER_EMAIL_KEY);

    // retrieve data from the service
    this.orderHistoryService.getOrderHistory(email).subscribe(data => {
      this.orderHistoryList = data._embedded.orders;
    })
  }

}
