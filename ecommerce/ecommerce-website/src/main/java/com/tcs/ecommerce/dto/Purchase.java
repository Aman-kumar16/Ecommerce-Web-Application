package com.tcs.ecommerce.dto;

import java.util.Set;

import com.tcs.ecommerce.entity.Address;
import com.tcs.ecommerce.entity.Customer;
import com.tcs.ecommerce.entity.Order;
import com.tcs.ecommerce.entity.OrderItem;

public class Purchase {

	private Customer customer;
	private Address shippingAddress;
	private Order order;
	private Set<OrderItem> orderItems;
	
	public Purchase(){
		
	}

	public Purchase(Customer customer, Address shippingAddress, Order order, Set<OrderItem> orderItems) {
		super();
		this.customer = customer;
		this.shippingAddress = shippingAddress;
		this.order = order;
		this.orderItems = orderItems;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public Address getShippingAddress() {
		return shippingAddress;
	}

	public void setShippingAddress(Address shippingAddress) {
		this.shippingAddress = shippingAddress;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public Set<OrderItem> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(Set<OrderItem> orderItems) {
		this.orderItems = orderItems;
	}
	
}
