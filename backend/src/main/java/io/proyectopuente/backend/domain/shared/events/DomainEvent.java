package io.proyectopuente.backend.domain.shared.events;

import java.time.Instant;

public interface DomainEvent {
    Instant occurredAt();
}
