package io.proyectopuente.backend.domain.simulation.conversation;

import io.proyectopuente.backend.domain.identity.UserId;
import io.proyectopuente.backend.domain.simulation.actor.ActorId;
import java.util.Objects;
import java.util.Optional;

public record Participant(
    UserId userId,
    ActorId actorId,
    String name,
    String role
) {
    public Participant {
        Objects.requireNonNull(name, "Participant name cannot be null");
        Objects.requireNonNull(role, "Participant role cannot be null");
        if (userId == null && actorId == null) {
            throw new IllegalArgumentException("Participant must be associated with either a UserId or an ActorId");
        }
        if (userId != null && actorId != null) {
            throw new IllegalArgumentException("Participant cannot represent both a user and an actor simultaneously");
        }
    }

    public static Participant ofUser(UserId userId, String name) {
        return new Participant(userId, null, name, "Student Developer");
    }

    public static Participant ofActor(ActorId actorId, String name, String role) {
        return new Participant(null, actorId, name, role);
    }

    public boolean isUser() {
        return userId != null;
    }

    public boolean isActor() {
        return actorId != null;
    }

    public Optional<UserId> getUserId() {
        return Optional.ofNullable(userId);
    }

    public Optional<ActorId> getActorId() {
        return Optional.ofNullable(actorId);
    }
}
