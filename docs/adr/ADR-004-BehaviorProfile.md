# ADR-004: BehaviorProfile using Enums

## Contexto
En un diseño preliminar, los perfiles de comportamiento de los actores virtuales (como el Tech Lead o Product Owner) utilizaban atributos numéricos continuos (ej. `double strictness`, `double empathy`) para calibrar sus interacciones y respuestas automáticas de IA. Esto reducía la legibilidad y no transmitía intención de negocio clara en el código de dominio.

## Decisión
Reemplazamos los atributos numéricos continuos por **Enums expresivos** para modelar los perfiles de comportamiento en el MVP.

Ejemplos:
```java
public enum Strictness {
    LOW, MEDIUM, HIGH
}

public enum CommunicationStyle {
    DIRECT, FRIENDLY, FORMAL, ASSERTIVE
}
```

Estos enums representan categorías discretas bien delimitadas, facilitando la interpretación por parte del dominio y simplificando el posterior mapeo hacia prompts estructurados para la IA.

## Consecuencias
* **Positivas**:
  * El código del dominio se lee como lenguaje de negocio natural (Ubiquitous Language).
  * Facilidad para depurar y testear perfiles de comportamiento concretos.
* **Negativas**:
  * Menor granularidad matemática en comparación con valores numéricos continuos de punto flotante (aunque para el MVP esto es un beneficio de claridad).
