package com.tcs.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.tcs.ecommerce.entity.Country;
import com.tcs.ecommerce.entity.Product;
import com.tcs.ecommerce.entity.ProductCategory;
import com.tcs.ecommerce.entity.State;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

	@Autowired
	private EntityManager entityManager;
	
	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
		
		HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};
		
		//disable http methods for product: PUT, POST & DELETE
		
//		disableHttpMethods(Product.class,config, theUnsupportedActions);
		disableHttpMethods(ProductCategory.class,config, theUnsupportedActions);
		disableHttpMethods(Country.class,config, theUnsupportedActions);
		disableHttpMethods(State.class,config, theUnsupportedActions);

		// to explore our id of the entity
		exploreIds(config);
		
	}

	private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
		config.getExposureConfiguration()
	    .forDomainType(theClass)
	    .withItemExposure((metadata, httpMethods)-> httpMethods.disable(theUnsupportedActions))
	    .withCollectionExposure((metadata, httpMethods)-> httpMethods.disable(theUnsupportedActions));
	}
	
	private void exploreIds(RepositoryRestConfiguration config) {
		
		// expose entity ids
		
		// get a list of all entity classes from the entity manager
		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
		
		// create an array of the entity types
		List<Class> entityClasses = new ArrayList<>();
		
		// get the entity types for the entities
		for(EntityType tempEntityType: entities) {
			entityClasses.add(tempEntityType.getJavaType());
		}

		// expose the entity ids for the array of entity/domain types
		Class[] domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);
		
	}
	
}
