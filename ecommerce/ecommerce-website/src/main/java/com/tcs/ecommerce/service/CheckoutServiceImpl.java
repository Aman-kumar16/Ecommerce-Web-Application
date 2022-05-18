package com.tcs.ecommerce.service;

import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcs.ecommerce.dao.CustomerRepository;
import com.tcs.ecommerce.dao.ProductRepository;
import com.tcs.ecommerce.dto.Purchase;
import com.tcs.ecommerce.dto.PurchaseResponse;
import com.tcs.ecommerce.entity.Customer;
import com.tcs.ecommerce.entity.Order;
import com.tcs.ecommerce.entity.OrderItem;
import com.tcs.ecommerce.entity.Product;

@Service
public class CheckoutServiceImpl implements CheckoutService{

	@Autowired
	private CustomerRepository customerRepository;
	
	@Autowired
	private ProductRepository productRepository;
	
	@Override
	@Transactional
	public PurchaseResponse placeOrder(Purchase purchase) {

		//retrieve the order info from data transfer object
		Order order = purchase.getOrder();
		
		// generate tracking number
		String orderTrackingNumber = generateOrderTrackingNumber();
		order.setOrderTrackingNumber(orderTrackingNumber);
		
		// populate order with orderItems
		Set<OrderItem> orderItems = purchase.getOrderItems();
		orderItems.forEach(item -> order.add(item));
		
		// update the quantity in the database.
		updateItemQuantity(orderItems);
		System.out.println("called updateItemQuantity");

		
		// populate order with shipping address
		order.setShippingAddress(purchase.getShippingAddress());
		
		// populate customer with order
		Customer customer = purchase.getCustomer();
		
		// existing customer so use that customer from database.
		String email = customer.getEmail();
		
		Customer existingCustomer = customerRepository.findByEmail(email);
		
		if(existingCustomer!=null) {
			customer = existingCustomer;
		}
		
		customer.add(order);
		
		// save to the database
		customerRepository.save(customer);
		
		return new PurchaseResponse(orderTrackingNumber);
	}

	private String generateOrderTrackingNumber() {

		//generate a random UUID number 
		return UUID.randomUUID().toString();
	}
	
	private void updateItemQuantity(Set<OrderItem> orderItems) {
		
		System.out.println("inside updateItemQuantity");
		
		for(OrderItem tempItem: orderItems) {
			Long id = tempItem.getProductId();
			int qty = tempItem.getQuantity();
			
			Product product = productRepository.getById(id);
		    int totalStock = product.getStock();
		    int remainingStock = totalStock-qty;
		    
		    product.setStock(remainingStock);
		    System.out.println("stock of the product is " + product.getStock());
		    productRepository.save(product);
		}
		
	}

}
