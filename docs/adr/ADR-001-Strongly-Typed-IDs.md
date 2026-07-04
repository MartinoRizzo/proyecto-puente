# ADR-001: Strongly Typed IDs

## Contexto
En el diseño de nuestro dominio de simulación, la obsesión por tipos primitivos (Primitive Obsession) representa un riesgo para la expresividad y la seguridad del sistema. Utilizar `UUID` o `String` de manera genérica para identificar diferentes entidades (por ejemplo, `UserId`, `CompanyId`, `TicketId`) puede provocar errores difíciles de detectar en tiempo de compilación (como pasar accidentalmente un `UserId` donde se esperaba un `CompanyId`).

## Decisión
Utilizaremos **Strongly Typed IDs** implementados como `record` de Java para todos los identificadores del dominio.
Cada identificador encapsulará su valor interno (un `UUID` o `String` según corresponda) y proveerá métodos de fábrica consistentes:
* `random()` para generar identidades aleatorias de forma segura.
* `from(UUID/String)` para instanciación controlada.

Ejemplo:
```java
public record UserId(UUID value) {
    public static UserId random() {
        return new UserId(UUID.randomUUID());
    }
    
    public static UserId from(UUID uuid) {
        Objects.requireNonNull(uuid, "UUID cannot be null");
        return new UserId(uuid);
    }
}
```

## Consecuencias
* **Positivas**:
  * Eliminamos la Primitive Obsession.
  * Los errores de asignación de ID se detectan en tiempo de compilación.
  * El modelo de dominio es autodescriptivo y expresivo.
* **Negativas**:
  * Incremento menor en la cantidad de clases físicas en el proyecto.
  * Requiere mapeadores personalizados para JPA/Hibernate (resuelto en la capa de infraestructura).
