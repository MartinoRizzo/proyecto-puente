package io.proyectopuente.backend.domain.simulation.events;

import io.proyectopuente.backend.domain.shared.events.DomainEvent;
import io.proyectopuente.backend.domain.simulation.actor.ActorId;
import io.proyectopuente.backend.domain.simulation.ticket.TicketId;
import java.time.Instant;

public record TicketAssignedEvent(
    TicketId ticketId,
    ActorId actorId,
    Instant occurredAt
) implements DomainEvent {}
