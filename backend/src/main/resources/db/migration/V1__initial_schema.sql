-- V1__initial_schema.sql
-- Create initial tables for User, SimulationSession and LearningProfile

CREATE TABLE users (
    id UUID PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE learning_profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    frontend_skill INT NOT NULL DEFAULT 10,
    backend_skill INT NOT NULL DEFAULT 10,
    testing_skill INT NOT NULL DEFAULT 10,
    devops_skill INT NOT NULL DEFAULT 10,
    communication_skill INT NOT NULL DEFAULT 10,
    problem_solving_skill INT NOT NULL DEFAULT 10
);

CREATE TABLE simulation_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL,
    start_date DATE NOT NULL,
    simulation_date DATE NOT NULL,
    current_hour INT NOT NULL DEFAULT 9,
    current_day_of_sprint INT NOT NULL DEFAULT 1,
    total_sprint_days INT NOT NULL DEFAULT 10,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_simulation_sessions_user ON simulation_sessions(user_id);
