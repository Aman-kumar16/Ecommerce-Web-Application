package com.tcs.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.tcs.ecommerce.dto.JwtResponse;
import com.tcs.ecommerce.dto.LoginInfo;
import com.tcs.ecommerce.entity.Customer;
import com.tcs.ecommerce.jwt.helper.JwtUtil;
import com.tcs.ecommerce.service.RegisterUserService;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/user")
public class RegisterLoginController {

	@Autowired
	private RegisterUserService registerUserService;
	
	// for jwt
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private UserDetailsService customCustomerService;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@PostMapping("/register")
	public Customer registerUser(@RequestBody Customer customer) throws Exception {
		
		Customer response;
		
		try {
			response = registerUserService.register(customer);
		}catch(Exception e) {
			e.printStackTrace();
			throw new Exception("email already registered");
		}
		
		return response;
	}
	
	// this will login user and generates the token for first time.
	@RequestMapping( value="/login", method=RequestMethod.POST)
	public ResponseEntity<?> loginUser(@RequestBody LoginInfo loginInfo) throws Exception{
		System.out.println(loginInfo);
		
		try {
			
			System.out.println("inside loginUsermethod registerlogincontroller" + loginInfo.getEmail() + loginInfo.getPassword());
			this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginInfo.getEmail(), loginInfo.getPassword()));
			
		}catch(Exception e) {
			e.printStackTrace();
			throw new Exception("Bad Credentials");
		}
		
		//fine area means no exception
		UserDetails userDetails = this.customCustomerService.loadUserByUsername(loginInfo.getEmail());
		
		String token = this.jwtUtil.generateToken(userDetails);
		System.out.println("JWT generated Token" + token);
		
		// sending response in below fashion
		// {"token": "value"}
		
		return ResponseEntity.ok(new JwtResponse(token));
		
	}	
}
