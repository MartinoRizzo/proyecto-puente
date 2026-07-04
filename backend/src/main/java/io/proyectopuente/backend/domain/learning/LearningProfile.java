package io.proyectopuente.backend.domain.learning;

import io.proyectopuente.backend.domain.identity.UserId;
import java.util.Objects;

public class LearningProfile {
    private final LearningProfileId id;
    private final UserId userId;
    private SkillMatrix skillMatrix;

    public LearningProfile(LearningProfileId id, UserId userId, SkillMatrix skillMatrix) {
        this.id = Objects.requireNonNull(id, "LearningProfile ID cannot be null");
        this.userId = Objects.requireNonNull(userId, "User ID cannot be null");
        this.skillMatrix = Objects.requireNonNull(skillMatrix, "SkillMatrix cannot be null");
    }

    public static LearningProfile create(LearningProfileId id, UserId userId) {
        return new LearningProfile(id, userId, SkillMatrix.init());
    }

    public LearningProfileId getId() {
        return id;
    }

    public UserId getUserId() {
        return userId;
    }

    public SkillMatrix getSkillMatrix() {
        return skillMatrix;
    }

    public void upgradeFrontend(int points) {
        this.skillMatrix = this.skillMatrix.improveFrontend(points);
    }

    public void upgradeBackend(int points) {
        this.skillMatrix = this.skillMatrix.improveBackend(points);
    }

    public void upgradeTesting(int points) {
        this.skillMatrix = this.skillMatrix.improveTesting(points);
    }

    public void upgradeDevops(int points) {
        this.skillMatrix = this.skillMatrix.improveDevops(points);
    }

    public void upgradeCommunication(int points) {
        this.skillMatrix = this.skillMatrix.improveCommunication(points);
    }

    public void upgradeProblemSolving(int points) {
        this.skillMatrix = this.skillMatrix.improveProblemSolving(points);
    }
}
