package io.proyectopuente.backend;

import static com.tngtech.archunit.library.Architectures.onionArchitecture;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

@AnalyzeClasses(packages = "io.proyectopuente.backend")
public class ArchitectureTests {

    @ArchTest
    public static final ArchRule onion_architecture_is_respected = onionArchitecture()
            .domainModels("io.proyectopuente.backend.domain..")
            .domainServices("io.proyectopuente.backend.domain..") // Allow domain logic subpackages
            .applicationServices("io.proyectopuente.backend.application..")
            .adapter("infrastructure", "io.proyectopuente.backend.infrastructure..");
}
