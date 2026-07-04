/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Company, Ticket, PullRequest, SkillMatrix, SkillType } from "../types";
import { GitPullRequest, Code, CheckSquare, RefreshCw, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GitWorkspaceProps {
  company: Company;
  activeTicket: Ticket;
  onSubmitPR: (prTitle: string, branchName: string, selectedChoice: string, codeDiff: { file: string; additions: string[]; deletions: string[] }[]) => void;
  pullRequest: PullRequest | null;
  onApproveAndMerge: (updatedSkills: Partial<SkillMatrix>) => void;
}

export default function GitWorkspace({ company, activeTicket, onSubmitPR, pullRequest, onApproveAndMerge }: GitWorkspaceProps) {
  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [commitMessage, setCommitMessage] = useState("");
  const [branchName, setBranchName] = useState("feature/ledger-precision");
  const [prTitle, setPrTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Define problem code and choices based on company
  const getCodePlaygroundData = () => {
    if (company.id === "aurapay-fintech") {
      return {
        file: "LedgerService.java",
        buggyCode: `public double calculateTaxAndInterest(double amount, double rate) {
    // BUG: Pérdida de centavos por precisión de coma flotante
    double interest = amount * rate;
    return Math.round(interest * 100.0) / 100.0;
}`,
        choices: [
          {
            id: "choice-a",
            label: "A) Usar float en lugar de double para optimizar memoria en JVM.",
            preview: `public float calculateTaxAndInterest(float amount, float rate) {
    return Math.round(amount * rate * 100.0f) / 100.0f;
}`,
            isCorrect: false,
            grade: "WRONG",
            impact: { [SkillType.TECHNICAL_RIGOR]: -10, [SkillType.RELIABILITY]: -15 },
            explanation: "¡Grave error! El uso de coma flotante (float/double) siempre provoca errores de precisión en cálculos monetarios. La auditoría regulatoria de AuraPay fallará inmediatamente."
          },
          {
            id: "choice-b",
            label: "B) Migrar a BigDecimal y configurar RoundingMode.HALF_EVEN.",
            preview: `public BigDecimal calculateTaxAndInterest(BigDecimal amount, BigDecimal rate) {
    BigDecimal rawInterest = amount.multiply(rate);
    return rawInterest.setScale(2, RoundingMode.HALF_EVEN);
}`,
            isCorrect: true,
            grade: "CORRECT",
            impact: { [SkillType.TECHNICAL_RIGOR]: 25, [SkillType.RELIABILITY]: 20 },
            explanation: "¡Excelente! BigDecimal es el estándar de oro en Fintech. HALF_EVEN (redondeo bancario) minimiza el sesgo acumulativo en conciliaciones de millones de transacciones."
          },
          {
            id: "choice-c",
            label: "C) Seguir usando double, pero recortando los decimales sobrantes mediante casteo directo a int.",
            preview: `public double calculateTaxAndInterest(double amount, double rate) {
    double interest = amount * rate;
    return ((int)(interest * 100.0)) / 100.0;
}`,
            isCorrect: false,
            grade: "SUBOPTIMAL",
            impact: { [SkillType.TECHNICAL_RIGOR]: -5, [SkillType.RELIABILITY]: -10 },
            explanation: "Subóptimo y peligroso. El truncamiento tosco mediante casteo pierde centavos enteros de forma sistemática, lo que generará alertas rojas de contabilidad en el Ledger."
          }
        ]
      };
    } else if (company.id === "healio-healthcare") {
      return {
        file: "PatientReportExporter.java",
        buggyCode: `public PatientReport exportReport(Patient patient, ClinicalData data) {
    // BUG: Violación de HIPAA al imprimir DNI y Nombre Completo directamente en reportes
    return new PatientReport(patient.getDni(), patient.getFullName(), data.getVitals());
}`,
        choices: [
          {
            id: "choice-a",
            label: "A) Reemplazar el DNI por un Hash SHA-256 pero mantener el nombre completo visible para los doctores.",
            preview: `public PatientReport exportReport(Patient patient, ClinicalData data) {
    String secureDni = DigestUtils.sha256Hex(patient.getDni());
    return new PatientReport(secureDni, patient.getFullName(), data.getVitals());
}`,
            isCorrect: false,
            grade: "SUBOPTIMAL",
            impact: { [SkillType.TECHNICAL_RIGOR]: 10, [SkillType.RELIABILITY]: -5 },
            explanation: "Subóptimo. Aunque encriptas el DNI, mantener el nombre completo expuesto sigue violando la privacidad de datos clínicos de HIPAA de Healio."
          },
          {
            id: "choice-b",
            label: "B) Enmascarar el DNI y resumir el nombre completo a iniciales.",
            preview: `public PatientReport exportReport(Patient patient, ClinicalData data) {
    String maskedDni = "*****" + patient.getDni().substring(patient.getDni().length() - 4);
    String initials = patient.getFirstName().charAt(0) + "." + patient.getLastName().charAt(0) + ".";
    return new PatientReport(maskedDni, initials, data.getVitals());
}`,
            isCorrect: true,
            grade: "CORRECT",
            impact: { [SkillType.TECHNICAL_RIGOR]: 20, [SkillType.RELIABILITY]: 25 },
            explanation: "¡Perfecto! Cumples de forma estricta con las normativas HIPAA de Healio al enmascarar datos personales identificables (PII) mientras mantienes iniciales mínimas de referencia médica."
          },
          {
            id: "choice-c",
            label: "C) Simplemente omitir la exportación del paciente y generar reportes completamente vacíos de nombre.",
            preview: `public PatientReport exportReport(Patient patient, ClinicalData data) {
    return new PatientReport("ANONYMOUS", "ANONYMOUS", data.getVitals());
}`,
            isCorrect: false,
            grade: "WRONG",
            impact: { [SkillType.ADAPTABILITY]: -10, [SkillType.RELIABILITY]: -10 },
            explanation: "Incorrecto. Dejar el reporte médico sin ninguna inicial de correlación imposibilita a los laboratorios clínicos asociar el reporte a los pacientes, arruinando la usabilidad."
          }
        ]
      };
    } else {
      return {
        file: "StockCheckoutManager.java",
        buggyCode: `@Transactional
public void decrementStock(Long itemId, int quantity) {
    // BUG: Condición de carrera concurrente sin control de bloqueo optimista
    Item item = itemRepository.findById(itemId).orElseThrow();
    item.setStock(item.getStock() - quantity);
    itemRepository.save(item);
}`,
        choices: [
          {
            id: "choice-a",
            label: "A) Utilizar un lock pesimista WRITE en la consulta de base de datos SQL.",
            preview: `@Lock(LockModeType.PESSIMISTIC_WRITE)
public Item findWithLockById(Long id);`,
            isCorrect: false,
            grade: "SUBOPTIMAL",
            impact: { [SkillType.ADAPTABILITY]: -10, [SkillType.TECHNICAL_RIGOR]: 10 },
            explanation: "Subóptimo. Funciona para consistencia de datos, pero el bloqueo pesimista en base de datos degrada drásticamente la latencia de CartFlow durante eventos masivos como Black Friday."
          },
          {
            id: "choice-b",
            label: "B) Agregar @Version para bloqueo optimista de JPA y capturar la excepción con reintentos exponenciales.",
            preview: `// En Entidad Item:
@Version
private Long version;

// En Servicio de Stock:
@Transactional
public void decrementStock(Long itemId, int quantity) {
    try {
        Item item = itemRepository.findById(itemId).orElseThrow();
        item.setStock(item.getStock() - quantity);
        itemRepository.save(item);
    } catch (ObjectOptimisticLockingFailureException ex) {
        // Ejecuta reintento exponencial con resiliencia
    }
}`,
            isCorrect: true,
            grade: "CORRECT",
            impact: { [SkillType.TECHNICAL_RIGOR]: 25, [SkillType.ADAPTABILITY]: 20 },
            explanation: "¡Excelente elección! El bloqueo optimista mediante @Version permite procesar miles de compras concurrentes sin congelar tablas, resolviendo las carreras de stock con alta performance."
          },
          {
            id: "choice-c",
            label: "C) Sincronizar el método completo de Java usando la palabra reservada 'synchronized' en memoria.",
            preview: `public synchronized void decrementStock(Long itemId, int quantity) {
    // Sincroniza hilos locales de JVM
}`,
            isCorrect: false,
            grade: "WRONG",
            impact: { [SkillType.TECHNICAL_RIGOR]: -15, [SkillType.RELIABILITY]: -15 },
            explanation: "¡Mal diseño! La sincronización en memoria de JVM no funciona en entornos con múltiples réplicas de contenedores (escalado horizontal), lo que provocará fallos masivos de consistencia."
          }
        ]
      };
    }
  };

  const pgData = getCodePlaygroundData();

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId);
    const choice = pgData.choices.find(c => c.id === choiceId);
    if (choice) {
      setPrTitle(`Fix: Resolver issue crítica en ${pgData.file}`);
      setCommitMessage(`docs(refactor): migrar implementación legacy en ${pgData.file} para producción`);
    }
  };

  const handlePrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChoice) return;
    setSubmitting(true);

    const selectedOption = pgData.choices.find(c => c.id === selectedChoice)!;

    // Build interactive file diff for Git
    const codeDiff = [
      {
        file: pgData.file,
        additions: selectedOption.preview.split("\n"),
        deletions: pgData.buggyCode.split("\n")
      }
    ];

    setTimeout(() => {
      onSubmitPR(prTitle, branchName, selectedChoice, codeDiff);
      setSubmitting(false);
    }, 1500);
  };

  const currentChoiceObj = pgData.choices.find(c => c.id === selectedChoice);

  return (
    <div id="git-workspace-root" className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[600px] shadow-2xl">
      
      <AnimatePresence mode="wait">
        {!pullRequest ? (
          /* PULL REQUEST CREATION STAGE */
          <motion.div
            key="create-pr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 h-full"
          >
            {/* Left Column: Code Playground */}
            <div className="border-r border-slate-800 flex flex-col h-full bg-slate-950/20 p-5 overflow-y-auto">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <Code className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold font-mono text-slate-200">Editor de Código: {pgData.file}</span>
              </div>

              {/* Buggy code box */}
              <div className="bg-slate-950 border border-slate-850 rounded-lg p-4 font-mono text-[10.5px] text-slate-400 mb-5 relative overflow-x-auto">
                <div className="absolute top-2 right-3 text-[9px] text-rose-500 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded font-semibold">
                  CÓDIGO BUGGY LEGACY
                </div>
                <pre>{pgData.buggyCode}</pre>
              </div>

              {/* Multiple choices selector */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Soluciones de Refactor Propuestas:</span>
                {pgData.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice.id)}
                    className={`w-full text-left p-3.5 rounded-lg border text-xs leading-relaxed transition ${
                      selectedChoice === choice.id 
                        ? "bg-indigo-600/10 border-indigo-500 text-slate-100" 
                        : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Git Commit & Branch Form */}
            <div className="flex flex-col h-full bg-slate-900 p-5 overflow-y-auto">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <GitPullRequest className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono text-slate-200">Git staging & branch control</span>
              </div>

              {selectedChoice ? (
                <form onSubmit={handlePrSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Crear Rama (Branch)</label>
                    <input
                      type="text"
                      required
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Título de Pull Request</label>
                    <input
                      type="text"
                      required
                      value={prTitle}
                      onChange={(e) => setPrTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Mensaje del Commit</label>
                    <textarea
                      required
                      rows={2}
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-indigo-500 text-slate-200"
                    />
                  </div>

                  {/* Code preview of selected solution */}
                  <div className="bg-slate-950 border border-slate-850 rounded-lg p-4 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                    <div className="text-[8px] text-emerald-500 uppercase font-bold tracking-wider mb-1">Tu Solución Seleccionada:</div>
                    <pre>{currentChoiceObj?.preview}</pre>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs py-3 rounded-lg transition uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        SUBMITTING CODE AND RUNNING TESTS...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Confirmar Commit & Abrir Pull Request →
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                  <Sparkles className="w-8 h-8 text-slate-700 mb-2" />
                  <span className="text-xs font-mono">Selecciona una solución técnica de la izquierda para preparar tu Pull Request</span>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* CODE REVIEW STAGE (PULL REQUEST REVIEW) */
          <motion.div
            key="review-pr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            {/* PR Title Header */}
            <div className="bg-slate-950/80 border-b border-slate-800 p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-semibold">
                    ● OPEN PULL REQUEST #{pullRequest.id}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    rama: <strong className="text-slate-300 font-medium">{pullRequest.branchName}</strong>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 mt-2">{pullRequest.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Mesa de Revisión</span>
              </div>
            </div>

            {/* Split Screen: Left Side diff review, Right side comments */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
              {/* Left Side: Code Diff comparison */}
              <div className="border-r border-slate-800 p-5 overflow-y-auto bg-slate-950/10 max-h-[380px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider font-mono">
                  <span>Git Unified Diff</span>
                </div>
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 font-mono text-[10px] overflow-x-auto space-y-1">
                  {pullRequest.codeChanges[0].deletions.map((del, i) => (
                    <div key={`del-${i}`} className="bg-rose-950/20 text-rose-400 border-l-2 border-rose-500 px-2 py-0.5">
                      - {del}
                    </div>
                  ))}
                  <div className="h-2" />
                  {pullRequest.codeChanges[0].additions.map((add, i) => (
                    <div key={`add-${i}`} className="bg-emerald-950/20 text-emerald-400 border-l-2 border-emerald-500 px-2 py-0.5">
                      + {add}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Comments and approvals */}
              <div className="p-5 flex flex-col justify-between bg-slate-900/60 max-h-[380px]">
                <div className="overflow-y-auto space-y-4 pr-1">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Comentarios de Revisores (Code Review)</div>
                  {pullRequest.comments.map((comment, i) => (
                    <div key={i} className="bg-slate-950/60 border border-slate-850 rounded-xl p-3 text-xs leading-relaxed">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{comment.avatar}</span>
                        <span className="font-semibold text-slate-200">{comment.actorName}</span>
                        <span className="text-[9px] text-slate-500 font-mono ml-auto">{comment.timestamp}</span>
                      </div>
                      <p className="text-slate-300">{comment.content}</p>
                    </div>
                  ))}
                </div>

                {/* Approve & Merge Button if Approved */}
                <div className="pt-4 border-t border-slate-800 mt-4">
                  {pullRequest.status === "APPROVED" ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-xs font-mono">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>¡Aprobaciones completadas! Todos los tests automáticos pasaron y tienes el visto bueno de {company.techLead.name}.</span>
                      </div>
                      <button
                        onClick={() => {
                          const isCorrect = currentChoiceObj?.isCorrect;
                          const penalty = currentChoiceObj?.grade === "SUBOPTIMAL" ? -10 : 0;
                          
                          onApproveAndMerge({
                            [SkillType.TECHNICAL_RIGOR]: isCorrect ? 25 : (10 + penalty),
                            [SkillType.RELIABILITY]: isCorrect ? 20 : (10 + penalty),
                          });
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs py-3 rounded-lg transition uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        ✓ Combinar Pull Request (Merge to Main)
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-3 text-[11px] text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-lg">
                      La revisión técnica requiere que verifiques la decisión de tu código para cumplir con los estándares de {company.name}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
