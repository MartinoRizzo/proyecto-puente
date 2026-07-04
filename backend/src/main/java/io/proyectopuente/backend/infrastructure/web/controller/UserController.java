package io.proyectopuente.backend.infrastructure.web.controller;

import io.proyectopuente.backend.application.ports.UserRepository;
import io.proyectopuente.backend.domain.identity.User;
import io.proyectopuente.backend.domain.identity.UserId;
import io.proyectopuente.backend.domain.shared.model.EmailAddress;
import io.proyectopuente.backend.infrastructure.web.dto.UserRegistrationRequest;
import io.proyectopuente.backend.infrastructure.web.dto.UserResponse;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = Objects.requireNonNull(userRepository);
    }

    @PostMapping
    public ResponseEntity<UserResponse> registerUser(@RequestBody UserRegistrationRequest request) {
        EmailAddress email = EmailAddress.from(request.email());
        
        // If user already exists by email, return it to simplify the flow
        var existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return ResponseEntity.ok(UserResponse.fromDomain(existingUser.get()));
        }

        User newUser = User.register(
                UserId.random(),
                request.displayName(),
                email
        );
        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserResponse.fromDomain(newUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        return userRepository.findById(UserId.from(java.util.UUID.fromString(id)))
                .map(user -> ResponseEntity.ok(UserResponse.fromDomain(user)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
