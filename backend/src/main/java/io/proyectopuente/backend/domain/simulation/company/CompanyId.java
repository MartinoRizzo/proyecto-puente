package io.proyectopuente.backend.domain.simulation.company;

import java.util.Objects;
import java.util.UUID;

public record CompanyId(UUID value) {
    public CompanyId {
        Objects.requireNonNull(value, "Company ID value cannot be null");
    }

    public static CompanyId random() {
        return new CompanyId(UUID.randomUUID());
    }

    public static CompanyId from(UUID uuid) {
        return new CompanyId(uuid);
    }

    public static CompanyId from(String uuidString) {
        Objects.requireNonNull(uuidString, "UUID string cannot be null");
        return new CompanyId(UUID.fromString(uuidString));
    }
}
