package com.tcs.ecommerce.service;

import com.tcs.ecommerce.dto.Purchase;
import com.tcs.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

	PurchaseResponse placeOrder(Purchase purchase);
}
