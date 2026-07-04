package io.proyectopuente.backend.domain.simulation.conversation;

import java.util.Objects;
import java.util.UUID;

public record MessageId(UUID value) {
    public MessageId {
        Objects.requireNonNull(value, "Message ID value cannot be null");
    }

    public static MessageId random() {
        return new MessageId(UUID.randomUUID());
    }

    public static MessageId from(UUID uuid) {
        return new MessageId(uuid);
    }

    public static MessageId from(String uuidString) {
        Objects.requireNonNull(uuidString, "UUID string cannot be null");
        return new MessageId(UUID.fromString(uuidString));
    }
}
