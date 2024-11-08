package com.creative_clarity.clarity_springboot.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @SuppressWarnings("null")
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow CORS for specific URL pattern (e.g., /api/course)
        registry.addMapping("/api/**")  // Allow CORS on all API endpoints
                .allowedOrigins("http://localhost:5173")  // Allow only from this origin
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allowed HTTP methods
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true);  // Allow credentials (cookies, authorization headers)
    }
}
