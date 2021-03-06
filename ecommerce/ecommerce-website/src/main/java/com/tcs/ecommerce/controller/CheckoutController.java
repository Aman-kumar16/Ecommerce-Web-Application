package com.tcs.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.tcs.ecommerce.dto.Purchase;
import com.tcs.ecommerce.dto.PurchaseResponse;
import com.tcs.ecommerce.service.CheckoutService;


@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/checkout")
public class CheckoutController {

	@Autowired
	private CheckoutService checkoutService;
	
	@RequestMapping( value="/purchase", method=RequestMethod.POST)
	public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
		
		PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
	
		return purchaseResponse;
	}	
}
