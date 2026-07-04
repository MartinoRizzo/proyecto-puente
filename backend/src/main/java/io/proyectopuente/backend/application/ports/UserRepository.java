package io.proyectopuente.backend.application.ports;

import io.proyectopuente.backend.domain.identity.User;
import io.proyectopuente.backend.domain.identity.UserId;
import io.proyectopuente.backend.domain.shared.model.EmailAddress;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findById(UserId id);
    Optional<User> findByEmail(EmailAddress email);
    void save(User user);
}
