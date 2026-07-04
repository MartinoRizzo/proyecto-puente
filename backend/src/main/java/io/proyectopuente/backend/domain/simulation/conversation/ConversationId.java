package io.proyectopuente.backend.domain.simulation.conversation;

import java.util.Objects;
import java.util.UUID;

public record ConversationId(UUID value) {
    public ConversationId {
        Objects.requireNonNull(value, "Conversation ID value cannot be null");
    }

    public static ConversationId random() {
        return new ConversationId(UUID.randomUUID());
    }

    public static ConversationId from(UUID uuid) {
        return new ConversationId(uuid);
    }

    public static ConversationId from(String uuidString) {
        Objects.requireNonNull(uuidString, "UUID string cannot be null");
        return new ConversationId(UUID.fromString(uuidString));
    }
}
