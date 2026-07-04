package io.proyectopuente.backend.domain.simulation.actor;

import java.util.Objects;

public record BehaviorProfile(
    Strictness strictness,
    CommunicationStyle communicationStyle,
    double empathy // Keep it as an example field but can also be categorized later
) {
    public BehaviorProfile {
        Objects.requireNonNull(strictness, "Strictness cannot be null");
        Objects.requireNonNull(communicationStyle, "CommunicationStyle cannot be null");
        if (empathy < 0.0 || empathy > 1.0) {
            throw new IllegalArgumentException("Empathy must be between 0.0 and 1.0");
        }
    }

    public static BehaviorProfile standard() {
        return new BehaviorProfile(Strictness.MEDIUM, CommunicationStyle.FRIENDLY, 0.7);
    }
}
/*
 * Puntos de extensión futuros (según propuesta del CTO):
 * - PromptProfile
 * - MemoryPolicy
 * - DecisionStrategy
 */
