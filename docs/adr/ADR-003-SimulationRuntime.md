# ADR-003: SimulationRuntime Architecture

## Contexto
El simulador debe modelar el paso del tiempo, las interacciones con actores virtuales y la evolución de los tickets del sprint sin acoplarse con la capa web (HTTP) ni con los frameworks de persistencia (Spring/JPA). El núcleo orquestador debe ser un motor reactivo de lógica de negocio pura.

## Decisión
Establecemos la pieza **SimulationRuntime** como el corazón orquestador de la simulación de Proyecto Puente.
Esta clase/servicio en el dominio no tiene dependencias de Spring, HTTP, JPA ni infraestructura.
* Recibe Commands procesados de la capa de aplicación.
* Orquesta las transiciones de estado sobre los agregados correspondientes (`SimulationSession`, `Ticket`, `Conversation`).
* Genera los eventos de dominio resultantes (`TicketAssignedEvent`, `MessagePostedEvent`, etc.).
* Funciona de forma aislada y predecible, facilitando los tests unitarios rápidos y deterministas.

## Consecuencias
* **Positivas**:
  * Alta testabilidad del flujo de simulación principal.
  * Desacoplamiento total de la tecnología de infraestructura.
  * El motor de simulación puede evolucionar de manera independiente del servidor web.
* **Negativas**:
  * Requiere mapeo explícito de objetos de dominio a entidades de persistencia en la capa de infraestructura.
