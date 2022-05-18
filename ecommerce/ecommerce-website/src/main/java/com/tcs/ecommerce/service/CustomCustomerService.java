package com.tcs.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tcs.ecommerce.dao.CustomerRepository;
import com.tcs.ecommerce.entity.CustomCustomer;
import com.tcs.ecommerce.entity.Customer;

@Service
public class CustomCustomerService implements UserDetailsService{

	@Autowired
	private CustomerRepository customerRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// here we are treating email as username so we will search for email.
		
		Customer user = customerRepository.findByEmail(username);
		
		if(user==null) {
			throw new UsernameNotFoundException("User Not Found");
		}
		
		return new CustomCustomer(user);
	}
	
	
	
}
