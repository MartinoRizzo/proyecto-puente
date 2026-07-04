# ADR-005: Domain Events Implementation

## Contexto
Los cambios significativos de estado en nuestro dominio (ej. asignación de tickets, finalización de sprints, mejoras en habilidades del estudiante) deben propagarse para notificar a otros agregados, actualizar proyecciones o emitir métricas. Crear múltiples abstracciones base para eventos complejiza el diseño.

## Decisión
Mantendremos una única interfaz común en el paquete compartido:
`domain/shared/events/DomainEvent.java`

Y cada Bounded Context definirá sus propios eventos específicos implementando esta interfaz utilizando `record` de Java para asegurar la inmutabilidad:
* `simulation/events/TicketAssignedEvent`
* `learning/events/SkillImprovedEvent`
* `identity/events/UserRegisteredEvent`

Esto simplifica el manejo y despacho de eventos en memoria sin requerir de inicio un bus de mensajería distribuido.

## Consecuencias
* **Positivas**:
  * Unificación del tratamiento de eventos.
  * Inmutabilidad garantizada mediante el uso de `record`.
  * Fácil de escuchar y reaccionar localmente.
* **Negativas**:
  * No hay bus físico distribuido (Kafka/RabbitMQ) inicialmente, pero este acoplamiento temporal en memoria es ideal para la fase MVP.
