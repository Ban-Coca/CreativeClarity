package com.creative_clarity.clarity_springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.creative_clarity.clarity_springboot.Service.UserService;
import com.creative_clarity.clarity_springboot.Entity.UserEntity;
import java.util.Date;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserService userService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/user/login", "/api/user/postuserrecord", 
                               "/api/user/forgot1", "/api/user/forgot2",
                               "/oauth2/**").permitAll()
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(this.oauth2UserService())
                )
                .successHandler((request, response, authentication) -> {
                    response.sendRedirect("http://localhost:5173/oauth2/redirect");
                })
            )
            .exceptionHandling(e -> e
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            );
            
        return http.build();
    }

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        
        return request -> {
            OAuth2User oauth2User = delegate.loadUser(request);
            
            // Extract user details based on the provider
            String email;
            String name;
            
            if (request.getClientRegistration().getRegistrationId().equals("github")) {
                // GitHub specific attribute extraction
                email = oauth2User.getAttribute("email");
                name = oauth2User.getAttribute("name");
                if (email == null) {
                    // GitHub might not provide email directly, you might need to handle this case
                    email = oauth2User.getAttribute("login") + "@github.com";
                }
            } else {
                // Google specific attribute extraction (existing logic)
                email = oauth2User.getAttribute("email");
                name = oauth2User.getAttribute("name");
            }
            
            // Check if user exists
            UserEntity existingUser = userService.findByEmail(email);
            if (existingUser == null) {
                // Create new user
                UserEntity user = new UserEntity();
                user.setEmail(email);
                user.setUsername(email);
                user.setPassword(passwordEncoder().encode("oauth2user")); // generate random password
                user.setFirstName(name);
                user.setCreated_at(new Date());
                
                userService.postUserRecord(user);
            }
            
            return oauth2User;
        };
    }
}