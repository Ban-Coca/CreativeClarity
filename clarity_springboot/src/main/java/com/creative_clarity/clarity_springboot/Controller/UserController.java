package com.creative_clarity.clarity_springboot.Controller;

import java.util.List;
import java.util.Date;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creative_clarity.clarity_springboot.Entity.UserEntity;
import com.creative_clarity.clarity_springboot.Service.UserService;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
	
	private static final Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	UserService userv;

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.expiration}")
	private Long jwtExpiration;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	@GetMapping("/print")
	public String print() {
		return "Hello, User";
	}

	@PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");

            logger.info("Login attempt for email: {}", email);

            // Find user by email
            UserEntity user = userv.findByEmail(email);
            if (user == null) {
                logger.warn("No user found with email: {}", email);
                return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password"));
            }

            // Check password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                logger.warn("Invalid password for email: {}", email);
                return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password"));
            }

            // Generate JWT token
            String token = generateToken(user);
            logger.info("Successfully generated token for user: {}", email);

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                "userId", user.getUserId(),
                "email", user.getEmail(),
                "username", user.getUsername()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Login error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    private String generateToken(UserEntity user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
            .setSubject(Long.toString(user.getUserId()))
            .setIssuedAt(new Date())
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
	
	//Create of CRUD
	@PostMapping("/postuserrecord")
    public ResponseEntity<?> postStudentRecord(@RequestBody UserEntity user) {
        try {
            logger.info("Received registration request for email: {}", user.getEmail());
            
            // Validate required fields
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            if (user.getPhoneNumber() == null || user.getPhoneNumber().isEmpty()) {
                return ResponseEntity.badRequest().body("Phone number is required");
            }
            
            // Encrypt the password before saving
            String encryptedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encryptedPassword);
            
            // Set username and created_at
            user.setUsername(user.getEmail());
            user.setCreated_at(new Date());
            
            UserEntity savedUser = userv.postUserRecord(user);
            
            // Don't send the encrypted password back in the response
            savedUser.setPassword(null);
            
            return ResponseEntity.ok(savedUser);
            
        } catch (Exception e) {
            logger.error("Error creating user: ", e);
            return ResponseEntity.badRequest()
                .body("Error creating user: " + e.getMessage());
        }
    }

    @PostMapping("/forgot1")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            logger.info("Email verification attempt for: {}", email);

            // Find user by email
            UserEntity user = userv.findByEmail(email);
            
            if (user == null) {
                logger.warn("No user found with email: {}", email);
                return ResponseEntity.status(404)
                    .body(Map.of("error", "Email not found"));
            }

            // Email exists
            logger.info("Email verification successful for: {}", email);
            return ResponseEntity.ok()
                .body(Map.of("message", "Email verified successfully"));

        } catch (Exception e) {
            logger.error("Email verification error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Email verification failed: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot2")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String newPassword = request.get("newPassword");
            
            logger.info("Password reset attempt for email: {}", email);

            // Validate inputs
            if (email == null || email.isEmpty() || newPassword == null || newPassword.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email and new password are required"));
            }

            // Find user by email
            UserEntity user = userv.findByEmail(email);
            if (user == null) {
                logger.warn("No user found with email: {}", email);
                return ResponseEntity.status(404)
                    .body(Map.of("error", "User not found"));
            }

            // Encrypt the new password
            String encryptedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encryptedPassword);
            
            // Save the updated user
            userv.postUserRecord(user);

            logger.info("Password reset successful for email: {}", email);
            return ResponseEntity.ok()
                .body(Map.of("message", "Password reset successful"));

        } catch (Exception e) {
            logger.error("Password reset error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Password reset failed: " + e.getMessage()));
        }
    }

	//Read of CRUD
	@GetMapping("/getallusers")
	public List<UserEntity> getAllUsers(){
		return userv.getAllUsers();
	}
		
	//Update of CRUD
	@PutMapping("/putuserdetails")
	public UserEntity putUserDetails(@RequestParam int userId, @RequestBody UserEntity newUserDetails) {
		return userv.putUserDetails(userId, newUserDetails);
	}
		
	//Delete of CRUD
	@DeleteMapping("/deleteuserdetails/{userId}")
	public String deleteUser(@PathVariable int userId) {
		return userv.deleteUser(userId);
	}
}
