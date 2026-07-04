package io.proyectopuente.backend.domain.simulation;

import java.util.Objects;
import java.util.UUID;

public record SimulationSessionId(UUID value) {
    public SimulationSessionId {
        Objects.requireNonNull(value, "SimulationSession ID value cannot be null");
    }

    public static SimulationSessionId random() {
        return new SimulationSessionId(UUID.randomUUID());
    }

    public static SimulationSessionId from(UUID uuid) {
        return new SimulationSessionId(uuid);
    }

    public static SimulationSessionId from(String uuidString) {
        Objects.requireNonNull(uuidString, "UUID string cannot be null");
        return new SimulationSessionId(UUID.fromString(uuidString));
    }
}
