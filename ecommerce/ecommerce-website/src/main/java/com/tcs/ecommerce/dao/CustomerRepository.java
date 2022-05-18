package com.tcs.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.tcs.ecommerce.entity.Customer;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource
public interface CustomerRepository extends JpaRepository<Customer, Long>{

	Customer findByEmail(String email);

}
