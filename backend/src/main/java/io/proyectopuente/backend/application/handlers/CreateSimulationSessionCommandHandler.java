package io.proyectopuente.backend.application.handlers;

import io.proyectopuente.backend.application.commands.CreateSimulationSessionCommand;
import io.proyectopuente.backend.application.ports.EventPublisher;
import io.proyectopuente.backend.application.ports.SimulationSessionRepository;
import io.proyectopuente.backend.domain.shared.time.TimeProvider;
import io.proyectopuente.backend.domain.simulation.SimulationSession;
import io.proyectopuente.backend.domain.simulation.SimulationSessionId;
import io.proyectopuente.backend.domain.simulation.events.SimulationStartedEvent;
import java.time.LocalDate;
import java.util.Objects;
import org.springframework.stereotype.Service;

@Service
public class CreateSimulationSessionCommandHandler {

    private final SimulationSessionRepository sessionRepository;
    private final TimeProvider timeProvider;
    private final EventPublisher eventPublisher;

    public CreateSimulationSessionCommandHandler(
            SimulationSessionRepository sessionRepository,
            TimeProvider timeProvider,
            EventPublisher eventPublisher) {
        this.sessionRepository = Objects.requireNonNull(sessionRepository);
        this.timeProvider = Objects.requireNonNull(timeProvider);
        this.eventPublisher = Objects.requireNonNull(eventPublisher);
    }

    public SimulationSessionId handle(CreateSimulationSessionCommand command) {
        // Deactivate existing sessions for the user if any
        sessionRepository.findActiveByUserId(command.userId()).ifPresent(session -> {
            session.completeSession();
            sessionRepository.save(session);
        });

        SimulationSessionId sessionId = SimulationSessionId.random();
        LocalDate startDate = timeProvider.currentDate();

        SimulationSession newSession = SimulationSession.startNew(
                sessionId,
                command.userId(),
                command.companyId(),
                startDate,
                command.sprintDays()
        );

        sessionRepository.save(newSession);

        // Publish event
        eventPublisher.publish(new SimulationStartedEvent(
                sessionId,
                command.userId(),
                timeProvider.now()
        ));

        return sessionId;
    }
}
