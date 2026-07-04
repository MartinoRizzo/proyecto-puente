package io.proyectopuente.backend.domain.simulation.actor;

import java.util.Objects;

public class Actor {
    private final ActorId id;
    private final String name;
    private final String role;
    private final BehaviorProfile behaviorProfile;

    public Actor(ActorId id, String name, String role, BehaviorProfile behaviorProfile) {
        this.id = Objects.requireNonNull(id, "Actor ID cannot be null");
        this.name = Objects.requireNonNull(name, "Name cannot be null");
        this.role = Objects.requireNonNull(role, "Role cannot be null");
        this.behaviorProfile = Objects.requireNonNull(behaviorProfile, "Behavior profile cannot be null");
    }

    public ActorId getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public BehaviorProfile getBehaviorProfile() {
        return behaviorProfile;
    }
}
