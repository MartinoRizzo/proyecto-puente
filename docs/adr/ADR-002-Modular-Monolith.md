# ADR-002: Modular Monolith Architecture

## Contexto
Proyecto Puente necesita crecer de manera ordenada pero ágil. Una arquitectura de microservicios añadiría una sobrecarga cognitiva, de red y operacional excesiva para el MVP. Sin embargo, un monolito acoplado (big ball of mud) dificultaría la migración a futuro y la mantenibilidad general del sistema.

## Decisión
Implementaremos una arquitectura de **Modular Monolith** (Monolito Modular).
El backend estará dividido en módulos bien definidos, correspondientes a los **Bounded Contexts** identificados:
* `identity`: Registro de usuarios y autenticación OAuth.
* `learning`: Gestión de perfiles de aprendizaje y matriz de habilidades.
* `simulation`: Core del simulador (sesiones, tickets, conversaciones, timelines).
* `shared`: Conceptos transversales (tiempo, eventos de dominio base, utilitarios).

La comunicación entre contextos respetará los límites de agregados. Ningún contexto accederá a la base de datos de otro directamente. Las interacciones se darán mediante interfaces públicas (Ports/Contracts) o eventos de dominio asíncronos en memoria.

## Consecuencias
* **Positivas**:
  * Bajo coste de despliegue y desarrollo (un solo proceso en ejecución).
  * Desacoplamiento lógico fuerte entre módulos.
  * Preparado para una transición a microservicios si el modelo de negocio lo requiere a futuro.
* **Negativas**:
  * Requiere disciplina férrea y herramientas de verificación estática (como ArchUnit) para evitar fugas de dependencias indeseadas entre paquetes.
