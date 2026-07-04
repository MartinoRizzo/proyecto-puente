package io.proyectopuente.backend.domain.simulation.events;

import io.proyectopuente.backend.domain.shared.events.DomainEvent;
import io.proyectopuente.backend.domain.simulation.SimulationSessionId;
import io.proyectopuente.backend.domain.simulation.timeline.Timeline;
import java.time.Instant;

public record VirtualTimeAdvancedEvent(
    SimulationSessionId sessionId,
    Timeline newTimeline,
    Instant occurredAt
) implements DomainEvent {}
