package io.proyectopuente.backend.domain.simulation.ticket;

import java.util.Objects;
import java.util.UUID;

public record TicketId(UUID value) {
    public TicketId {
        Objects.requireNonNull(value, "Ticket ID value cannot be null");
    }

    public static TicketId random() {
        return new TicketId(UUID.randomUUID());
    }

    public static TicketId from(UUID uuid) {
        return new TicketId(uuid);
    }

    public static TicketId from(String uuidString) {
        Objects.requireNonNull(uuidString, "UUID string cannot be null");
        return new TicketId(UUID.fromString(uuidString));
    }
}
