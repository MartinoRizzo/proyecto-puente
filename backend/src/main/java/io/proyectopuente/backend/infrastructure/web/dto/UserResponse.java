package io.proyectopuente.backend.infrastructure.web.dto;

import io.proyectopuente.backend.domain.identity.User;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String displayName,
    String email
) {
    public static UserResponse fromDomain(User user) {
        return new UserResponse(
            user.getId().value(),
            user.getDisplayName(),
            user.getEmail().value()
        );
    }
}
