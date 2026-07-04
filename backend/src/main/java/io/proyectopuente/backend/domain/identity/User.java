package io.proyectopuente.backend.domain.identity;

import io.proyectopuente.backend.domain.shared.model.EmailAddress;
import java.util.Objects;

public class User {
    private final UserId id;
    private String displayName;
    private EmailAddress email;

    public User(UserId id, String displayName, EmailAddress email) {
        this.id = Objects.requireNonNull(id, "User ID cannot be null");
        this.displayName = Objects.requireNonNull(displayName, "Display name cannot be null");
        this.email = Objects.requireNonNull(email, "Email cannot be null");
    }

    public static User register(UserId id, String displayName, EmailAddress email) {
        return new User(id, displayName, email);
    }

    public UserId getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public EmailAddress getEmail() {
        return email;
    }

    public void changeDisplayName(String newDisplayName) {
        this.displayName = Objects.requireNonNull(newDisplayName, "New display name cannot be null").trim();
    }

    public void changeEmail(EmailAddress newEmail) {
        this.email = Objects.requireNonNull(newEmail, "New email cannot be null");
    }
}
