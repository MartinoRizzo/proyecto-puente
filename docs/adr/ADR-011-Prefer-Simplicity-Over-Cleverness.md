# ADR-011: Prefer Simplicity Over Cleverness

## Contexto
A veces, para resolver problemas de negocio sencillos, se introducen soluciones técnicas "inteligentes" o altamente sofisticadas (ej. motores de reglas abstractas, DSLs propios, metaprogramación) que aumentan drásticamente la deuda técnica de la aplicación, dificultan las revisiones de código y complican el onboarding de nuevos miembros del equipo.

## Decisión
En Proyecto Puente elegiremos siempre **la solución más simple posible** que respete los lineamientos arquitectónicos definidos.
La sofisticación técnica solo se justificará cuando se demuestre que una solución simple no es viable debido a rendimiento, seguridad o requisitos de negocio inevitables.
El código directo, explícito e imperativo es preferido por encima del código altamente abstracto o mágico.

## Consecuencias
* **Positivas**:
  * Código altamente mantenible y fácil de leer.
  * Proceso de Code Review ágil y enfocado en la lógica del negocio.
  * Curva de aprendizaje plana para cualquier persona que se integre al proyecto.
* **Negativas**:
  * Puede percibirse como "menos sofisticado" o más repetitivo en ciertos puntos (boilerplate), aunque el boilerplate explícito es más seguro que la abstracción mágica invisible.
