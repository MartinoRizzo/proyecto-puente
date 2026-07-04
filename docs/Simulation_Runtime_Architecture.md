# Simulation Runtime Architecture: "BridgeOS Kernel"
## Proyecto Puente — Documento de Arquitectura y Diseño de Sistema

---

## 1. Introducción y Filosofía de Diseño: De Simulación a Runtime

En las primeras fases de diseño, conceptualizamos un **Simulation Engine** orientado a emular una empresa, sus sprints y sus tickets. Sin embargo, bajo la visión del CTO, damos un salto de abstracción fundamental: **no estamos construyendo un simulador de desarrollo de software; estamos construyendo un Runtime de Simulación Sociotécnica Genérica.**

Inspirándonos en motores de videojuegos como **Unity** o runtimes distribuidos como **Erlang/OTP**, diseñamos el **BridgeOS Kernel**. 
Este Kernel es completamente agnóstico de las reglas del desarrollo de software, de la metodología ágil o de la jerarquía de una empresa tecnológica. El Kernel solo conoce:

1. **Actors (Actores):** Entidades autónomas (humanas o virtuales) con estado, memoria y capacidades de comunicación.
2. **Events (Eventos):** Unidades de información inmutables que fluyen por el sistema y desencadenan transiciones.
3. **Rules (Reglas):** Evaluadores deterministas que validan condiciones sobre el estado global y emiten nuevos eventos o mutaciones.
4. **State Machine (Máquina de Estados):** El grafo de estados activos del entorno de simulación.
5. **Timeline / Ticks (Tiempo):** Un reloj virtual que maneja la cadencia, los deadlines y las frecuencias de acción de los actores.
6. **Objectives (Objetivos):** Condiciones de victoria, aprendizaje o resolución de conflictos.

Bajo este enfoque, un "Sprint de Scrum en una startup Fintech" no es más que un **Simulation Package** que se monta y se ejecuta sobre el **BridgeOS Kernel**.

```
+-----------------------------------------------------------------+
|                         BRIDGEOS RUNTIME                        |
|                                                                 |
|   +--------------------+  +------------------+  +-----------+   |
|   |   Event Router     |  | State Classifier |  | Chronos   |   |
|   |   (Event-Driven)   |  | (Deterministic)  |  | (Virtual) |   |
|   +---------+----------+  +--------+---------+  +-----+-----+   |
+-------------|----------------------|------------------|---------+
              |                      |                  |
              v                      v                  v
+-----------------------------------------------------------------+
|                       SIMULATION PACKAGE                        |
|                                                                 |
|   +-------------------+  +------------------+  +------------+   |
|   |  Actors & Roles   |  | Workflows (DAGs) |  | Rule Book  |   |
|   +-------------------+  +------------------+  +------------+   |
|   +-------------------+  +------------------+  +------------+   |
|   | Prompts / Context |  | System Assets    |  | Objectives |   |
|   +-------------------+  +------------------+  +------------+   |
+-----------------------------------------------------------------+
```

---

## 2. El Simulation Package: El Formato de Distribución

Un escenario ya no es código acoplado; es un **Simulation Package (Paquete de Simulación)**. Este paquete es modular, versionable, auto-contenido y almacenable en un repositorio de objetos o base de datos.

### Estructura del Package (`package.zip` o directorio estructurado):

```
/package-manifest.json
/actors/
   ├── tech_lead.json
   ├── product_owner.json
   └── dev_peer_senior.json
/workflows/
   ├── onboarding_flow.json
   ├── pull_request_review_flow.json
   └── production_hotfix_flow.json
/rules/
   ├── trigger_rules.json
   └── grading_rules.json
/prompts/
   ├── base_system_prompts.json
   └── conversation_personas.json
/assets/
   ├── mock_emails.json
   ├── mock_slack_channels.json
   └── backlog_initial_state.json
/objectives/
   └── evaluation_matrix.json
```

### Especificación del `package-manifest.json`:
```json
{
  "id": "package-fintech-onboarding-v1",
  "name": "Fintech Startup: Hypergrowth Stress",
  "version": "1.0.4",
  "description": "Simula la entrada a una startup Fintech hiperactiva con deadlines agresivos y deuda técnica severa.",
  "requiredCapabilities": ["COGNITIVE_CHAT", "CODE_ANALYSIS", "STRESS_INJECTION"],
  "language": "es-ES",
  "entrypoint": "workflows/onboarding_flow.json"
}
```

---

## 3. Arquitectura del Runtime: "BridgeOS"

El backend en **Java 21 / Spring Boot** no contendrá lógica de negocio de "reuniones" o "PRs". Será el motor que implemente los siguientes componentes núcleo (Engines):

### A. Chronos Engine (El Tiempo Virtual)
La simulación no ocurre en tiempo real estricto, ni tampoco es instantánea. Chronos gestiona:
- **Virtual Time-Scale:** 1 hora en la simulación equivale a 5 minutos reales, o se sincroniza con eventos asíncronos (por ejemplo, el usuario aprieta "Terminar jornada").
- **Cron Desencadenadores:** Programa eventos de simulación asíncronos en cola (`at_virtual_time("09:30 AM", TriggerEvent.MORNING_STANDUP)`).

### B. State & Event Router (El Corazón Reactivo)
Todo cambio en el sistema es un evento.
1. El usuario envía un mensaje o sube un commit -> Genera `UserActionSubmittedEvent`.
2. El Router recibe el evento y busca en el `Rule Book` del paquete activo si hay alguna regla que reaccione a este evento.
3. Si la regla se cumple, el estado de la simulación muta, y opcionalmente se encola un evento para un **Agente IA**.

### C. Workflow Engine (Ejecutor de Grafo)
El Workflow Engine utiliza grafos acíclicos dirigidos (DAGs) o Redes de Petri declaradas en JSON para guiar la simulación.
- **Ejemplo de Pull Request Flow:**
  `SUBMITTED` -> `STATIC_ANALYSIS_RUNNING` -> `ASSIGNED_TO_LEAD` -> `WAITING_FOR_REVIEW` -> `CHANGES_REQUESTED` o `APPROVED`.
- El Runtime sabe cómo transicionar entre nodos del grafo evaluando eventos del sistema, sin importar si el nodo es "Revisar un PR" o "Aprobar un presupuesto".

---

## 4. AI Agent Engine: El Modelo de Coconsciencia y Optimización de Costos

### El Desafío Financiero e Infraestructura
Llamar a modelos de lenguaje avanzados (como Gemini 1.5 Pro o 2.5) para cada interacción de 8 agentes virtuales haría que la startup fuera económicamente inviable (costo masivo de tokens).

### Solución: Arquitectura de Agente Híbrida (Cognitive Layer + Heuristic Layer)
Para evitar el "desperdicio" de tokens, dividimos el cerebro de los agentes en tres capas:

```
                  +----------------------------------+
                  |           EVENTO DE ENTRADA      |
                  +-----------------+----------------+
                                    |
                                    v
                  +-----------------+----------------+
                  |      Capas Heurística / Reglas   |
                  | (0 Tokens - Evaluación en Java)  |
                  +-----------------+----------------+
                                    |
                  +-----------------+----------------+
                  |  ¿Requiere Decisión Cognitiva?  |
                  +-------+------------------+-------+
                          |                  |
                       Sí |                  | No (Ej: Respuesta rápida templated)
                          v                  v
                  +-------+----------+   +---+-------------------------+
                  | LLM Agent Engine |   | Motor de Reglas / Templates |
                  | (Llamada Intelig)|   | (Costo Cero)                |
                  +------------------+   +-----------------------------+
```

1. **La Capa de Percepción Heurística (Costo Cero):** 
   Un agente de IA no necesita un LLM para saber que el usuario llegó tarde a una reunión. El Runtime en Java calcula esto matemáticamente y envía un evento pre-estructurado.
2. **Capa de Memoria Vectorial y Resumen Semántico (RAG Localizado):**
   Cada agente tiene un "Contexto de Corto Plazo" (los últimos 5 eventos) y una "Memoria de Largo Plazo" (un almacén vectorial ligero con resúmenes de interacciones previas). Nunca enviamos la historia completa de la conversación al LLM.
3. **El Pool de Agentes Virtuales Colectivo (Shared Context Pipeline):**
   En lugar de hacer 5 llamadas independientes para 5 compañeros que opinan de un PR, el **AI Engine** hace **una sola llamada "multirrol"** al modelo enviando el estado del PR y recibiendo una estructura JSON estructurada con las opiniones de múltiples agentes en un solo viaje de red.

### Estructura de un Agente en el AI Engine:
```typescript
interface AIAgent {
  id: string;
  role: "TECH_LEAD" | "PRODUCT_OWNER" | "PEER_DEVELOPER" | "QA";
  personality: {
    assertiveness: number; // 0.0 a 1.0
    empathy: number;       // 0.0 a 1.0
    technicalStrictness: number;
    communicationStyle: string; // "direct", "passive-aggressive", "mentorship"
  };
  shortTermMemory: Event[];
  longTermMemoryRef: string; // ID de vector db
}
```

---

## 5. Learning Engine: El Adaptador Biométrico de la Simulación

El **Learning Engine** es la capa de inteligencia de negocio y educativa de Proyecto Puente. Su misión es doble: evaluar de manera objetiva al usuario y adaptar la dificultad de la simulación en tiempo real.

```
+-------------------------------------------------------------+
|                      LEARNING ENGINE                        |
+-------------------------------------------------------------+
|                                                             |
|   +-----------------------+     +-----------------------+   |
|   |  Cognitive Telemetry  | --> |     Skill Matrix      |   |
|   |  (Análisis de Acción) |     |  (Hard & Soft Skills) |   |
|   +-----------------------+     +-----------+-----------+   |
|                                             |               |
|                                             v               |
|   +-----------------------+     +-----------+-----------+   |
|   |   Dynamic Stresser    | <-- |  Simulator Matcher    |   |
|   | (Outage / Requirement) |     |  (Ajuste de Paquete)  |   |
|   +-----------------------+     +-----------------------+   |
|                                                             |
+-------------------------------------------------------------+
```

### Funcionalidades Núcleo del Learning Engine:

1. **La Matriz de Competencias Dinámica (Skill Matrix):**
   Mide dimensiones de nivel técnico (**Hard Skills**) y conductual (**Soft Skills**):
   - **Technical Rigor:** Calidad de código, cobertura de tests, manejo de excepciones.
   - **Communication Style:** Respeto, claridad en Slack/Mails, asertividad bajo presión.
   - **Adaptability:** Velocidad ante cambios de requerimiento repentinos de Product Owners.
   - **Reliability:** Cumplimiento de deadlines simulados y puntualidad.

2. **Detección de Patrones de Comportamiento:**
   Si el usuario copia y pega código directamente de StackOverflow/IA sin entenderlo, o si aprueba PRs de compañeros virtuales sin leer el código, el **Learning Engine** detecta este patrón.

3. **Inyección Dinámica de Intervenciones (The Chaos Monkey of Learning):**
   Si la matriz indica que el usuario sobresale en desarrollo pero tiene una baja tolerancia a la frustración o mala comunicación con el Product Owner, el Learning Engine inyecta un evento imprevisto:
   - *Evento:* `PRODUCTION_CRASH_ON_USER_CODE` (Inyectado un viernes virtual a las 4:30 PM).
   - El objetivo es obligar al usuario a comunicarse con el Tech Lead bajo presión.

---

## 6. Stack Tecnológico de Implementación Detallado

Para soportar este Runtime con un diseño mantenible para los próximos 5 años, definimos el stack y la arquitectura de carpetas del Backend:

* **Runtime Host:** Java 21 / Spring Boot 3.4+.
* **Event Broker:** Spring ApplicationEvents (en memoria para baja latencia inicial) transicionando a **Apache Kafka** o **RabbitMQ** cuando escalemos horizontalmente.
* **Database:** PostgreSQL para persistencia de estados de simulación, históricos de eventos (Event Sourcing parcial) y perfiles de usuario.
* **Vector Store:** PGVector (extensión de PostgreSQL) para mantener las memorias vectoriales de los agentes IA en la misma base de datos, optimizando costos y simplificando infraestructura.
* **LLM Orchestration:** Spring AI (para integración nativa con modelos de Google Vertex AI / Gemini).

---

## 7. Plan de Transición y Primer Hito (El MVP "Hello World" del Runtime)

Para validar esta arquitectura sin sobre-diseñar, implementaremos el **Hito 1: El Simulador Mínimo Viable**.

### Objetivo del Hito 1:
Ejecutar una simulación de 10 minutos donde:
1. Se carga un paquete básico conteniendo **1 Agente (Tech Lead)**, **1 Canal de Chat** y **1 Regla de Bienvenida**.
2. El usuario entra, el Chronos Engine marca el "Día 1 - 09:00 AM".
3. El Router de Eventos detecta el inicio y dispara el correo de bienvenida del Tech Lead.
4. El usuario responde. El AI Engine intercepta el mensaje, genera una respuesta adaptada a la personalidad del Tech Lead y muta el estado a "Onboarding Completado".

---

## 8. Análisis de Riesgos y Mitigación de Deuda Técnica

1. **Riesgo de Latencia de IA (UI Bloqueada):**
   * *Mitigación:* Las llamadas al AI Engine deben ser asíncronas. La UI recibirá eventos vía **WebSockets (Server-Sent Events / SSE)**. Cuando un agente IA esté "escribiendo", el usuario verá el feedback visual de forma reactiva.
2. **Deriva Cognitiva del Agente (Alucinación):**
   * *Mitigación:* El AI Engine inyectará estrictamente las reglas de negocio en el System Prompt de cada interacción. Los agentes no deciden libremente las reglas del sistema; el Runtime valida las reglas de manera determinista y la IA solo decide la "capa comunicacional y la intención".
3. **Explosión en Base de Datos (Event Logs infinitos):**
   * *Mitigación:* Implementar snapshots del estado de la máquina de simulación cada "fin de día virtual", permitiendo archivar o purgar eventos antiguos irrelevantes para la lógica de transiciones activa.
