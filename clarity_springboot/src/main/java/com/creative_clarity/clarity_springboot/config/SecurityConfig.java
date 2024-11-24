package com.creative_clarity.clarity_springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.creative_clarity.clarity_springboot.Service.UserService;
import com.creative_clarity.clarity_springboot.Entity.UserEntity;
import java.util.Date;
import java.util.Arrays;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/user/login",
                    "/api/user/postuserrecord",
                    "/api/user/forgot1",
                    "/api/user/forgot2",
                    "/api/user/upload-profile-picture",
                    "/oauth2/**",
                    "/login/**",
                    "/uploads/**",
                    "/api/uploads/**" // Ensure this line is included to permit access to uploads
                ).permitAll()
                .requestMatchers("/api/user/update-profile").authenticated()
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll() // Explicitly permit GET requests to uploads
                .anyRequest().authenticated()
                )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(this.oauth2UserService())
                )
                .successHandler((request, response, authentication) -> {
                    OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
                    String token = generateToken(oauth2User);
                    String redirectUrl = String.format(
                        "http://localhost:5173/oauth2/redirect?token=%s",
                        token
                    );
                    response.sendRedirect(redirectUrl);
                })
            )
            .exceptionHandling(e -> e
                .authenticationEntryPoint((request, response, authException) -> {
                    logger.error("Unauthorized error: {}", authException.getMessage());
                    response.sendError(HttpStatus.UNAUTHORIZED.value(), authException.getMessage());
                })
            );
            
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Your frontend URL
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private String generateToken(OAuth2User oauth2User) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 86400000); // 24 hours
        
        // Get the user's ID from your UserService
        String email = oauth2User.getAttribute("email");
        UserEntity user = userService.findByEmail(email);
        String userId = String.valueOf(user.getUserId()); // Convert ID to string

        return Jwts.builder()
            .setSubject(userId) // Use ID instead of email
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        
        return request -> {
            OAuth2User oauth2User = delegate.loadUser(request);
            String registrationId = request.getClientRegistration().getRegistrationId();
            
            String email;
            String name;
            
            switch (registrationId) {
                case "github":
                    email = oauth2User.getAttribute("email");
                    if (email == null) {
                        String login = oauth2User.getAttribute("login");
                        email = login + "@github.com";
                    }
                    name = oauth2User.getAttribute("name");
                    if (name == null) {
                        name = oauth2User.getAttribute("login");
                    }
                    break;
                    
                case "facebook":
                    email = oauth2User.getAttribute("email");
                    name = oauth2User.getAttribute("name");
                    break;
                    
                default: // Google and others
                    email = oauth2User.getAttribute("email");
                    name = oauth2User.getAttribute("name");
            }
            
            // Create or update user
            UserEntity user = userService.findByEmail(email);
            if (user == null) {
                user = new UserEntity();
                user.setEmail(email);
                user.setUsername(email);
                user.setPassword(passwordEncoder().encode("oauth2user"));
                user.setCreated_at(new Date());
                
                if (name != null) {
                    String[] nameParts = name.split(" ", 2);
                    user.setFirstName(nameParts[0]);
                    if (nameParts.length > 1) {
                        user.setLastName(nameParts[1]);
                    }
                }
                
                userService.postUserRecord(user);
            }
            
            return oauth2User;
        };
    }
}