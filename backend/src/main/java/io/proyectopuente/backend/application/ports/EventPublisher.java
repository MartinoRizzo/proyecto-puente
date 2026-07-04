package io.proyectopuente.backend.application.ports;

import io.proyectopuente.backend.domain.shared.events.DomainEvent;

public interface EventPublisher {
    void publish(DomainEvent event);
}
