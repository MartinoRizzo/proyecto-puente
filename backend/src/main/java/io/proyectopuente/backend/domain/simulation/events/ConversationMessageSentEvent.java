package io.proyectopuente.backend.domain.simulation.events;

import io.proyectopuente.backend.domain.shared.events.DomainEvent;
import io.proyectopuente.backend.domain.simulation.conversation.ConversationId;
import io.proyectopuente.backend.domain.simulation.conversation.Message;
import java.time.Instant;

public record ConversationMessageSentEvent(
    ConversationId conversationId,
    Message message,
    Instant occurredAt
) implements DomainEvent {}
