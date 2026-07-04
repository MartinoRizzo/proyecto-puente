/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Company, Actor, Ticket } from "../types";

export const COMPANIES: Company[] = [
  {
    id: "aurapay-fintech",
    name: "AuraPay",
    industry: "Fintech",
    culture: "Alta presión, obsesión con la precisión de los datos y auditorías regulatorias rigurosas. No se tolera la pérdida de precisión monetaria.",
    stack: ["Java 21", "Spring Boot", "PostgreSQL", "Kafka", "JUnit 5"],
    description: "Una plataforma de pagos internacionales en pleno hipercrecimiento que procesa más de 10 millones de transacciones diarias.",
    techLead: {
      id: "tl-aurapay",
      name: "Alejandro 'Ale' Silva",
      role: "TECH_LEAD",
      avatar: "👨‍💻",
      personality: {
        strictness: 5,
        empathy: 3,
        communicationStyle: "direct"
      }
    },
    productOwner: {
      id: "po-aurapay",
      name: "Sofía Martínez",
      role: "PRODUCT_OWNER",
      avatar: "👩‍💼",
      personality: {
        strictness: 4,
        empathy: 4,
        communicationStyle: "direct"
      }
    },
    peerDeveloper: {
      id: "peer-aurapay",
      name: "Martín Rizzo",
      role: "PEER_DEVELOPER",
      avatar: "👦",
      personality: {
        strictness: 2,
        empathy: 5,
        communicationStyle: "mentorship"
      }
    }
  },
  {
    id: "healio-healthcare",
    name: "Healio",
    industry: "Healthcare",
    culture: "Extremadamente metódica, obsesionada con la privacidad del paciente (HIPAA) y la documentación detallada antes de tirar código.",
    stack: ["Java 17", "Spring Boot", "PostgreSQL", "Hibernate", "Docker"],
    description: "Un portal clínico que conecta hospitales principales con laboratorios de análisis clínicos de alta fidelidad.",
    techLead: {
      id: "tl-healio",
      name: "Dra. Elena Rossi",
      role: "TECH_LEAD",
      avatar: "👩‍🔬",
      personality: {
        strictness: 4,
        empathy: 5,
        communicationStyle: "mentorship"
      }
    },
    productOwner: {
      id: "po-healio",
      name: "Sebastián Gómez",
      role: "PRODUCT_OWNER",
      avatar: "👨‍💼",
      personality: {
        strictness: 3,
        empathy: 3,
        communicationStyle: "direct"
      }
    },
    peerDeveloper: {
      id: "peer-healio",
      name: "Clara Ortiz",
      role: "PEER_DEVELOPER",
      avatar: "👩‍💻",
      personality: {
        strictness: 3,
        empathy: 4,
        communicationStyle: "mentorship"
      }
    }
  },
  {
    id: "cartflow-ecommerce",
    name: "CartFlow",
    industry: "E-commerce",
    culture: "Cultura ágil extrema, despliegue continuo rápido, obsesión por el rendimiento y la optimización de caché bajo eventos de alto tráfico.",
    stack: ["Java 21", "Spring Boot", "Redis", "PostgreSQL", "Docker"],
    description: "El motor de checkout de marca blanca líder para minoristas medianos en América Latina.",
    techLead: {
      id: "tl-cartflow",
      name: "Hugo Méndez",
      role: "TECH_LEAD",
      avatar: "🧔",
      personality: {
        strictness: 3,
        empathy: 2,
        communicationStyle: "passive-aggressive"
      }
    },
    productOwner: {
      id: "po-cartflow",
      name: "Valentina Paz",
      role: "PRODUCT_OWNER",
      avatar: "👩‍🎤",
      personality: {
        strictness: 5,
        empathy: 3,
        communicationStyle: "direct"
      }
    },
    peerDeveloper: {
      id: "peer-cartflow",
      name: "Nico Peralta",
      role: "PEER_DEVELOPER",
      avatar: "👱",
      personality: {
        strictness: 4,
        empathy: 3,
        communicationStyle: "direct"
      }
    }
  }
];

export const INITIAL_TICKETS: { [companyId: string]: Ticket[] } = {
  "aurapay-fintech": [
    {
      id: "AP-1042",
      title: "Corregir error de redondeo de precisión en el servicio de libro contable (Ledger)",
      description: "El servicio Ledger utiliza double para realizar conversiones de tipo de cambio, lo que genera pequeñas discrepancias de centavos en conciliaciones masivas. Debemos migrar la precisión a BigDecimal y asegurar que las pruebas unitarias cubran los casos límite con redondeo HALF_EVEN.",
      difficulty: "Medium",
      status: "TODO",
      points: 5
    }
  ],
  "healio-healthcare": [
    {
      id: "HL-3011",
      title: "Implementar anonimización de datos de pacientes en la exportación de reportes clínicos",
      description: "La función de exportación de PDFs clínicos está imprimiendo el DNI y nombre completo del paciente directamente. Según regulación de privacidad, el sistema debe ofuscar el identificador principal y mantener únicamente iniciales en el reporte.",
      difficulty: "Medium",
      status: "TODO",
      points: 5
    }
  ],
  "cartflow-ecommerce": [
    {
      id: "CF-2041",
      title: "Resolver carrera de desincronización de stock al procesar carritos de compras simultáneos",
      description: "Durante picos de tráfico elevados, dos peticiones simultáneas restan stock del mismo artículo sin validación de concurrencia optimista, dejando stock negativo en la base de datos PostgreSQL. Debemos usar @Version para bloqueo optimista de JPA.",
      difficulty: "Medium",
      status: "TODO",
      points: 5
    }
  ]
};
