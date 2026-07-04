package io.proyectopuente.backend.domain.simulation.actor;

import java.util.Objects;
import java.util.UUID;

public record ActorId(UUID value) {
    public ActorId {
        Objects.requireNonNull(value, "Actor ID value cannot be null");
    }

    public static ActorId random() {
        return new ActorId(UUID.randomUUID());
    }

    public static ActorId from(UUID uuid) {
        return new ActorId(uuid);
    }

    public static ActorId from(String uuidString) {
        Objects.requireNonNull(uuidString, "UUID string cannot be null");
        return new ActorId(UUID.fromString(uuidString));
    }
}
