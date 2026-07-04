package io.proyectopuente.backend.domain.simulation.runtime;

import io.proyectopuente.backend.domain.simulation.ticket.TicketStatus;
import java.util.Objects;

/**
 * Core engine/motor of Proyecto Puente. Coordinates core domain evaluations,
 * time progression events, and state changes during active sessions.
 */
public class SimulationRuntime {

    public SimulationRuntime() {}

    /**
     * Evaluates a student action on a ticket in the context of the active actors and their behavior profiles.
     */
    public EvaluationResult evaluateStudentAction(EvaluationContext context, String actionType) {
        Objects.requireNonNull(context, "EvaluationContext cannot be null");
        Objects.requireNonNull(actionType, "ActionType cannot be null");

        // Simple domain logic for evaluating actions (extendable via rules/policies)
        boolean approved = false;
        String feedback = "";
        int skillPointsEarned = 0;

        switch (actionType.toUpperCase()) {
            case "COMMIT":
                if (context.activeTicket().getStatus() == TicketStatus.IN_PROGRESS) {
                    feedback = "Commit realizado con éxito. Los tests automáticos están pasando.";
                    skillPointsEarned = 5;
                    approved = true;
                } else {
                    feedback = "No puedes realizar un commit si el ticket no está en progreso.";
                }
                break;
            case "PULL_REQUEST":
                if (context.activeTicket().getStatus() == TicketStatus.IN_PROGRESS) {
                    feedback = "Pull Request creado. El Tech Lead revisará tu código pronto.";
                    skillPointsEarned = 10;
                    approved = true;
                } else {
                    feedback = "No hay cambios pendientes para abrir un Pull Request.";
                }
                break;
            default:
                feedback = "Acción desconocida en el simulador.";
                break;
        }

        return new EvaluationResult(approved, feedback, skillPointsEarned);
    }

    public record EvaluationResult(
        boolean success,
        String feedback,
        int skillPointsEarned
    ) {}
}
