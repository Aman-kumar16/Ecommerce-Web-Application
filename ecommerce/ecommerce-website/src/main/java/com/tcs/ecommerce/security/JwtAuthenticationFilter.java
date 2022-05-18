package com.tcs.ecommerce.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.tcs.ecommerce.jwt.helper.JwtUtil;
import com.tcs.ecommerce.service.CustomCustomerService;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{

	@Autowired
	private CustomCustomerService customCustomerService;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		//get jwt 		
		String requestTokenHeader = request.getHeader("Authorization");
		String username = null;
		String jwtToken = null;
		
		// null and format
		if(requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
			
			//remove Bearer from token
			jwtToken = requestTokenHeader.substring(7);
			
			try {
				// should return email in our case
				username = this.jwtUtil.getUsernameFromToken(jwtToken);
				
			}catch(Exception e) {
				System.out.println("Error in retrieving username from jwtToken ");
				e.printStackTrace();
			}
			
			UserDetails customerDetails = this.customCustomerService.loadUserByUsername(username);
			
			if(username != null && SecurityContextHolder.getContext().getAuthentication() == null ) {
				
				UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(customerDetails , null, customerDetails.getAuthorities());
				
				usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				
				SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
			
			}else {
				System.out.println("Token is not validated...");
			}
			
		}

		filterChain.doFilter(request,response);
		
	}

	
}
