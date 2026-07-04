package io.proyectopuente.backend.infrastructure.persistence;

import io.proyectopuente.backend.application.ports.UserRepository;
import io.proyectopuente.backend.domain.identity.User;
import io.proyectopuente.backend.domain.identity.UserId;
import io.proyectopuente.backend.domain.shared.model.EmailAddress;
import java.util.Objects;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private final UserSpringDataRepository springDataRepository;

    public UserRepositoryImpl(UserSpringDataRepository springDataRepository) {
        this.springDataRepository = Objects.requireNonNull(springDataRepository);
    }

    @Override
    public Optional<User> findById(UserId id) {
        return springDataRepository.findById(id.value())
                .map(this::toDomain);
    }

    @Override
    public Optional<User> findByEmail(EmailAddress email) {
        return springDataRepository.findByEmail(email.value())
                .map(this::toDomain);
    }

    @Override
    public void save(User user) {
        springDataRepository.save(toEntity(user));
    }

    private User toDomain(UserJpaEntity entity) {
        return new User(
                UserId.from(entity.getId()),
                entity.getDisplayName(),
                EmailAddress.from(entity.getEmail())
        );
    }

    private UserJpaEntity toEntity(User domain) {
        return new UserJpaEntity(
                domain.getId().value(),
                domain.getDisplayName(),
                domain.getEmail().value()
        );
    }
}
