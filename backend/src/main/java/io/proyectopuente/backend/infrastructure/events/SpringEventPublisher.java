package io.proyectopuente.backend.infrastructure.events;

import io.proyectopuente.backend.application.ports.EventPublisher;
import io.proyectopuente.backend.domain.shared.events.DomainEvent;
import java.util.Objects;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class SpringEventPublisher implements EventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    public SpringEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = Objects.requireNonNull(applicationEventPublisher);
    }

    @Override
    public void publish(DomainEvent event) {
        // Publishes to Spring's internal in-memory event system
        applicationEventPublisher.publishEvent(event);
    }
}
