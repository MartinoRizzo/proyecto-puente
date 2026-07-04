# ADR-010: Build Before Expand

## Contexto
Existe una tendencia natural en proyectos con un diseño rico a agregar capas, abstracciones o patrones avanzados (ej. distribuidores de eventos, colas de tareas, soporte multi-tenant) antes de tener las funcionalidades básicas del sistema operando y validadas de extremo a extremo.

## Decisión
Establecemos la regla de oro **"Build Before Expand"** (Construir antes de expandir).
No se incorporará ninguna nueva abstracción arquitectónica avanzada, patrón o servicio secundario a menos que resuelva un problema real e inmediato detectado durante la implementación de los flujos principales del MVP.
Todas las decisiones de diseño previas se mantendrán lo más simples y directas posible hasta que el sistema base esté funcionando.

## Consecuencias
* **Positivas**:
  * Reducción extrema del riesgo de sobrearquitectura (YAGNI).
  * Priorización de software que funciona por encima de modelos teóricos.
  * Mayor velocidad de desarrollo y entrega de valor.
* **Negativas**:
  * Podríamos tener que refactorizar de manera agresiva más adelante cuando incorporemos módulos más complejos (pero la refactorización guiada por código real es más segura).
