package io.proyectopuente.backend.domain.simulation.events;

import io.proyectopuente.backend.domain.identity.UserId;
import io.proyectopuente.backend.domain.shared.events.DomainEvent;
import io.proyectopuente.backend.domain.simulation.SimulationSessionId;
import java.time.Instant;

public record SimulationStartedEvent(
    SimulationSessionId sessionId,
    UserId userId,
    Instant occurredAt
) implements DomainEvent {}
