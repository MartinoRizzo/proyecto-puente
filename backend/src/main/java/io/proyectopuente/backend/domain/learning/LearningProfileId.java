package io.proyectopuente.backend.domain.learning;

import java.util.Objects;
import java.util.UUID;

public record LearningProfileId(UUID value) {
    public LearningProfileId {
        Objects.requireNonNull(value, "LearningProfile ID value cannot be null");
    }

    public static LearningProfileId random() {
        return new LearningProfileId(UUID.randomUUID());
    }

    public static LearningProfileId from(UUID uuid) {
        return new LearningProfileId(uuid);
    }

    public static LearningProfileId from(String uuidString) {
        Objects.requireNonNull(uuidString, "UUID string cannot be null");
        return new LearningProfileId(UUID.fromString(uuidString));
    }
}
