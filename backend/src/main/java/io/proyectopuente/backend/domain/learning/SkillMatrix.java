package io.proyectopuente.backend.domain.learning;

public record SkillMatrix(
    int frontend,
    int backend,
    int testing,
    int devops,
    int communication,
    int problemSolving
) {
    public SkillMatrix {
        validate(frontend, "frontend");
        validate(backend, "backend");
        validate(testing, "testing");
        validate(devops, "devops");
        validate(communication, "communication");
        validate(problemSolving, "problemSolving");
    }

    private static void validate(int value, String skillName) {
        if (value < 0 || value > 100) {
            throw new IllegalArgumentException(skillName + " skill level must be between 0 and 100, got: " + value);
        }
    }

    public static SkillMatrix init() {
        return new SkillMatrix(10, 10, 10, 10, 10, 10);
    }

    public SkillMatrix improveFrontend(int points) {
        return new SkillMatrix(
            Math.min(100, this.frontend + points),
            this.backend,
            this.testing,
            this.devops,
            this.communication,
            this.problemSolving
        );
    }

    public SkillMatrix improveBackend(int points) {
        return new SkillMatrix(
            this.frontend,
            Math.min(100, this.backend + points),
            this.testing,
            this.devops,
            this.communication,
            this.problemSolving
        );
    }

    public SkillMatrix improveTesting(int points) {
        return new SkillMatrix(
            this.frontend,
            this.backend,
            Math.min(100, this.testing + points),
            this.devops,
            this.communication,
            this.problemSolving
        );
    }

    public SkillMatrix improveDevops(int points) {
        return new SkillMatrix(
            this.frontend,
            this.backend,
            this.testing,
            Math.min(100, this.devops + points),
            this.communication,
            this.problemSolving
        );
    }

    public SkillMatrix improveCommunication(int points) {
        return new SkillMatrix(
            this.frontend,
            this.backend,
            this.testing,
            this.devops,
            Math.min(100, this.communication + points),
            this.problemSolving
        );
    }

    public SkillMatrix improveProblemSolving(int points) {
        return new SkillMatrix(
            this.frontend,
            this.backend,
            this.testing,
            this.devops,
            this.communication,
            Math.min(100, this.problemSolving + points)
        );
    }
}
