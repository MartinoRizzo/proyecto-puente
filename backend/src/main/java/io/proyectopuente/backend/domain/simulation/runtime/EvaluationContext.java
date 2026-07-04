package io.proyectopuente.backend.domain.simulation.runtime;

import io.proyectopuente.backend.domain.learning.SkillMatrix;
import io.proyectopuente.backend.domain.simulation.SimulationSession;
import io.proyectopuente.backend.domain.simulation.actor.Actor;
import io.proyectopuente.backend.domain.simulation.ticket.Ticket;
import java.util.List;
import java.util.Objects;

public record EvaluationContext(
    SimulationSession session,
    SkillMatrix studentSkills,
    Ticket activeTicket,
    List<Actor> activeActors
) {
    public EvaluationContext {
        Objects.requireNonNull(session, "SimulationSession cannot be null");
        Objects.requireNonNull(studentSkills, "StudentSkills cannot be null");
        Objects.requireNonNull(activeTicket, "ActiveTicket cannot be null");
        Objects.requireNonNull(activeActors, "ActiveActors list cannot be null");
    }
}
