package com.tcs.ecommerce.service;

import com.tcs.ecommerce.entity.Customer;

public interface RegisterUserService {

	Customer register(Customer customer) throws Exception;
	
}
