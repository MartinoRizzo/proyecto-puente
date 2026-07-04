package io.proyectopuente.backend.domain.simulation.events;

import io.proyectopuente.backend.domain.shared.events.DomainEvent;
import io.proyectopuente.backend.domain.simulation.ticket.TicketId;
import java.time.Instant;

public record TicketCompletedEvent(
    TicketId ticketId,
    Instant occurredAt
) implements DomainEvent {}
