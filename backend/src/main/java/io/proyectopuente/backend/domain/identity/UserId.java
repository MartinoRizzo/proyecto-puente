package io.proyectopuente.backend.domain.identity;

import java.util.Objects;
import java.util.UUID;

public record UserId(UUID value) {
    public UserId {
        Objects.requireNonNull(value, "User ID value cannot be null");
    }

    public static UserId random() {
        return new UserId(UUID.randomUUID());
    }

    public static UserId from(UUID uuid) {
        return new UserId(uuid);
    }

    public static UserId from(String uuidString) {
        Objects.requireNonNull(uuidString, "UUID string cannot be null");
        return new UserId(UUID.fromString(uuidString));
    }
}
