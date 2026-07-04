package io.proyectopuente.backend.application.ports;

import io.proyectopuente.backend.domain.identity.UserId;
import io.proyectopuente.backend.domain.simulation.SimulationSession;
import io.proyectopuente.backend.domain.simulation.SimulationSessionId;
import java.util.Optional;

public interface SimulationSessionRepository {
    Optional<SimulationSession> findById(SimulationSessionId id);
    Optional<SimulationSession> findActiveByUserId(UserId userId);
    void save(SimulationSession session);
}
