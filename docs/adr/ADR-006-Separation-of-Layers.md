# ADR-006: Separation of Application, Domain, and Infrastructure Layers

## Contexto
Para garantizar que nuestro núcleo de dominio permanezca completamente aislado de frameworks de persistencia, comunicaciones, seguridad y protocolos de transporte (HTTP/REST), es vital delimitar estrictamente las fronteras arquitectónicas del proyecto.

## Decisión
Adoptamos una arquitectura hexagonal / limpia con una separación tripartita estricta:
1. **Domain Layer (`domain`)**: Contiene las entidades, agregados, value objects, políticas, especificaciones y eventos. No tiene dependencias de librerías externas o frameworks de Spring.
2. **Application Layer (`application`)**: Contiene los Commands, CommandHandlers, y define las interfaces/puertos de entrada y salida (`ports`), como repositorios, reloj de sistema, y publicadores de eventos. No contiene lógica REST ni HTTP.
3. **Infrastructure Layer (`infrastructure`)**: Contiene las implementaciones físicas de los puertos (JPA, PostgreSQL, Spring Boot configuration, Spring Security, etc.) y los controladores web/REST con sus DTOs asociados.

La dirección de dependencias fluye únicamente hacia el centro:
`Infrastructure -> Application -> Domain`

## Consecuencias
* **Positivas**:
  * Dominio puramente reutilizable y desacoplado de bases de datos o frameworks.
  * Facilidad extrema para realizar pruebas unitarias en aislamiento.
  * Permite intercambiar tecnologías de infraestructura (por ejemplo, cambiar JPA por JDBC, o REST por GraphQL) sin alterar la lógica del negocio.
* **Negativas**:
  * Mayor número de archivos y mapeos necesarios entre capas (DTo -> Command -> Domain -> Entity).
