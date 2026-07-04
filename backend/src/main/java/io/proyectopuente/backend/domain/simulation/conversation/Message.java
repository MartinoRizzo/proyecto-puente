package io.proyectopuente.backend.domain.simulation.conversation;

import java.time.Instant;
import java.util.Objects;

public record Message(
    MessageId id,
    Participant sender,
    String content,
    Instant sentAt
) {
    public Message {
        Objects.requireNonNull(id, "Message ID cannot be null");
        Objects.requireNonNull(sender, "Sender cannot be null");
        Objects.requireNonNull(content, "Content cannot be null");
        Objects.requireNonNull(sentAt, "Sent at timestamp cannot be null");
        if (content.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }
    }
}
