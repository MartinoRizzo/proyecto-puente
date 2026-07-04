/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GitBranch, Globe, ShieldAlert, Terminal, MessageSquare, Briefcase, Award } from "lucide-react";
import { SkillMatrix, SkillType, Company } from "../types";
import { COMPANIES } from "../data/companies";

interface OnboardingProps {
  onComplete: (user: { name: string; email: string; provider: "google" | "github" }, skills: SkillMatrix, assignedCompany: Company) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<"WELCOME" | "INTERVIEW" | "RESULT">("WELCOME");
  const [userName, setUserName] = useState("");
  const [provider, setProvider] = useState<"google" | "github" | null>(null);
  
  // Skill Matrix initial states
  const [skills, setSkills] = useState<SkillMatrix>({
    [SkillType.TECHNICAL_RIGOR]: 50,
    [SkillType.COMMUNICATION]: 50,
    [SkillType.ADAPTABILITY]: 50,
    [SkillType.RELIABILITY]: 50,
  });

  // Interactive interview state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [dialogs, setDialogs] = useState<{ sender: "recruiter" | "user"; text: string }[]>([
    {
      sender: "recruiter",
      text: "¡Hola! Bienvenido/a al portal de reclutamiento de Proyecto Puente. Soy Caro, Directora de Talent Acquisition. Estoy muy entusiasmada de conocerte. Para empezar, ¿podrías decirme tu nombre?"
    }
  ]);
  const [tempName, setTempName] = useState("");

  const INTERVIEW_QUESTIONS = [
    {
      id: 1,
      text: "Un cliente reporta un bug intermitente de pérdida de redondeo en transacciones del backend el viernes a las 18:00. ¿Cuál es tu plan de acción?",
      options: [
        {
          label: "Escribo un test de integración para reproducir el bug, aislo el servicio Ledger y uso BigDecimal con redondeo HALF_EVEN antes de subir un PR limpio.",
          impact: { [SkillType.TECHNICAL_RIGOR]: 25, [SkillType.RELIABILITY]: 20, [SkillType.ADAPTABILITY]: -5 },
          reason: "Priorizas la excelencia técnica y las buenas prácticas, demostrando alto rigor."
        },
        {
          label: "Hago un fix rápido (hotfix) directamente en producción para calmar al cliente y el lunes escribo los tests unitarios correspondientes.",
          impact: { [SkillType.ADAPTABILITY]: 25, [SkillType.TECHNICAL_RIGOR]: -15, [SkillType.RELIABILITY]: 5 },
          reason: "Eres pragmático y adaptable, aunque propenso a acumular deuda técnica bajo presión."
        },
        {
          label: "Reporto de inmediato al Tech Lead, abro una sala técnica de Slack para alertar al equipo de infraestructura y redacto un reporte de incidente.",
          impact: { [SkillType.COMMUNICATION]: 25, [SkillType.RELIABILITY]: 15, [SkillType.TECHNICAL_RIGOR]: 5 },
          reason: "Tu comunicación es estelar; prefieres alinear al equipo antes de tomar riesgos solos."
        }
      ]
    },
    {
      id: 2,
      text: "A mitad de un sprint de 2 semanas, el Product Owner te cambia el requerimiento de una feature que ya tenías terminada en un 80%. ¿Cómo respondes?",
      options: [
        {
          label: "Acepto el cambio con entusiasmo, rediseño mi arquitectura sobre la marcha y busco horas extra para cumplir con la fecha de entrega acordada.",
          impact: { [SkillType.ADAPTABILITY]: 25, [SkillType.RELIABILITY]: 10, [SkillType.TECHNICAL_RIGOR]: -5 },
          reason: "Tienes una flexibilidad extrema para adaptarte al cambio, asumiendo la presión."
        },
        {
          label: "Solicito una reunión de 10 minutos con el Product Owner para explicarle el impacto técnico, el aumento de story points y acordar qué ticket del backlog sacar.",
          impact: { [SkillType.COMMUNICATION]: 25, [SkillType.TECHNICAL_RIGOR]: 15, [SkillType.RELIABILITY]: 15 },
          reason: "Posees gran madurez profesional. Negocias con argumentos basados en datos y recursos."
        },
        {
          label: "Me opongo firmemente argumentando que el sprint ya está congelado por Scrum Guide, y que el cambio debe ingresar formalmente en el próximo sprint.",
          impact: { [SkillType.TECHNICAL_RIGOR]: 20, [SkillType.COMMUNICATION]: -10, [SkillType.ADAPTABILITY]: -15 },
          reason: "Defiendes ferozmente los procesos técnicos establecidos, aunque con cierta rigidez."
        }
      ]
    },
    {
      id: 3,
      text: "Tu compañero de equipo virtual te pide que apruebes un Pull Request urgente, pero notas que omitió las pruebas unitarias por falta de tiempo. ¿Qué haces?",
      options: [
        {
          label: "Le pongo un 'Block' temporal al PR de forma constructiva, proponiéndole un bloque de test base para que solo tenga que rellenar las variables.",
          impact: { [SkillType.TECHNICAL_RIGOR]: 25, [SkillType.COMMUNICATION]: 15, [SkillType.RELIABILITY]: 10 },
          reason: "Enseñas con empatía pero sin comprometer la calidad del codebase fundacional."
        },
        {
          label: "Apruebo el PR para no bloquear el sprint, y me anoto un recordatorio personal en Jira para agregar los tests faltantes el próximo lunes.",
          impact: { [SkillType.ADAPTABILITY]: 15, [SkillType.RELIABILITY]: -15, [SkillType.TECHNICAL_RIGOR]: -20 },
          reason: "Eres servicial y evitas el conflicto inmediato, pero asumes riesgos de regresiones graves."
        },
        {
          label: "Le pido que hagamos una sesión rápida de Live Share de 15 minutos para programar juntos los tests y así realizar el merge de forma segura hoy mismo.",
          impact: { [SkillType.COMMUNICATION]: 25, [SkillType.RELIABILITY]: 20, [SkillType.TECHNICAL_RIGOR]: 15 },
          reason: "Excelente sentido del trabajo en equipo colaborativo bajo buenas prácticas."
        }
      ]
    }
  ];

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    setUserName(tempName);
    setDialogs(prev => [
      ...prev,
      { sender: "user", text: `Mi nombre es ${tempName}.` },
      { sender: "recruiter", text: `¡Mucho gusto, ${tempName}! Es un placer tenerte a bordo. Antes de asignarte tu equipo y empresa, voy a hacerte 3 preguntas de diagnóstico situacional basadas en incidentes reales que ocurren en producción. ¿Estás listo/a?` }
    ]);
  };

  const startInterview = (selectedProvider: "google" | "github") => {
    setProvider(selectedProvider);
    setStep("INTERVIEW");
    setDialogs(prev => [
      ...prev,
      { sender: "recruiter", text: `Excelente. Comencemos con la primera situación:\n\n"${INTERVIEW_QUESTIONS[0].text}"` }
    ]);
  };

  const handleOptionSelect = (option: typeof INTERVIEW_QUESTIONS[0]["options"][0]) => {
    // Apply changes to matrix
    setSkills(prev => {
      const next = { ...prev };
      Object.entries(option.impact).forEach(([key, val]) => {
        const k = key as SkillType;
        next[k] = Math.max(10, Math.min(100, next[k] + val));
      });
      return next;
    });

    // Record response dialogues
    const userMsg = option.label;
    const nextQIdx = currentQuestionIdx + 1;

    setDialogs(prev => [
      ...prev,
      { sender: "user", text: userMsg },
      nextQIdx < INTERVIEW_QUESTIONS.length
        ? { sender: "recruiter", text: `Interesante postura. Siguiente pregunta: ${INTERVIEW_QUESTIONS[nextQIdx].text}` }
        : { sender: "recruiter", text: "¡Excelente! He completado tu perfil cognitivo y técnico. Deja que analice tus respuestas para emparejarte con el equipo y la empresa que mejor se adapten a tu estilo de trabajo y objetivos de crecimiento..." }
    ]);

    if (nextQIdx < INTERVIEW_QUESTIONS.length) {
      setCurrentQuestionIdx(nextQIdx);
    } else {
      // Transition to analysis step
      setTimeout(() => {
        setStep("RESULT");
      }, 2500);
    }
  };

  // Determine assigned company based on the highest skills
  const getAssignedCompany = (): Company => {
    // If TECHNICAL_RIGOR is highest -> AuraPay (Fintech)
    // If COMMUNICATION or RELIABILITY is highest -> Healio (Healthcare)
    // If ADAPTABILITY is highest -> CartFlow (E-commerce)
    const rigor = skills[SkillType.TECHNICAL_RIGOR];
    const comms = skills[SkillType.COMMUNICATION];
    const adapt = skills[SkillType.ADAPTABILITY];

    if (rigor >= comms && rigor >= adapt) {
      return COMPANIES[0]; // AuraPay
    } else if (adapt >= comms) {
      return COMPANIES[2]; // CartFlow
    } else {
      return COMPANIES[1]; // Healio
    }
  };

  const assignedCompany = getAssignedCompany();

  const handleFinishOnboarding = () => {
    onComplete(
      {
        name: userName || "Junior Dev",
        email: `${(userName || "junior").toLowerCase().replace(/\s+/g, "")}@proyecto-puente.com`,
        provider: provider || "google"
      },
      skills,
      assignedCompany
    );
  };

  return (
    <div id="onboarding-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-indigo-500/30">
      
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-2xl relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full text-xs text-indigo-400 font-mono mb-3"
          >
            <GitBranch className="w-3 h-3" />
            BUILDING SYSTEM: RUNTIME v1.2.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-sans font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-indigo-200 to-indigo-400"
          >
            Proyecto Puente
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm mt-2 max-w-md mx-auto"
          >
            El simulador definitivo de experiencia laboral sociotécnica. No es un curso. Es tu primer día de trabajo real.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME SCREEN & NAME */}
          {step === "WELCOME" && (
            <motion.div
              key="welcome-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 shadow-2xl backdrop-blur-md"
            >
              <h2 className="text-xl font-bold font-sans text-slate-200 mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                Ingreso al Equipo Fundador
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Para iniciar tu simulación, por favor ingresa tu nombre y asóciate con uno de tus proveedores de desarrollo para importar tus llaves SSH y perfil.
              </p>

              <form onSubmit={handleNameSubmit} className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Nombre Completo del Desarrollador</label>
                  <input
                    type="text"
                    required
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="E.g., Martín Gabriel"
                    disabled={userName !== ""}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-100 disabled:opacity-50"
                  />
                </div>
                {userName === "" && (
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-lg text-sm font-semibold transition"
                  >
                    Confirmar Identidad
                  </button>
                )}
              </form>

              {userName !== "" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Registrarse vía Proveedor de Código</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => startInterview("github")}
                      className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 py-3 rounded-lg text-sm hover:bg-slate-900 transition"
                    >
                      <GitBranch className="w-4 h-4 text-indigo-400" />
                      GitHub Auth
                    </button>
                    <button
                      onClick={() => startInterview("google")}
                      className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 py-3 rounded-lg text-sm hover:bg-slate-900 transition"
                    >
                      <Globe className="w-4 h-4 text-emerald-400" />
                      Google Auth
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 2: INTERVIEW CHAT */}
          {step === "INTERVIEW" && (
            <motion.div
              key="interview-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col h-[500px] shadow-2xl backdrop-blur-md overflow-hidden"
            >
              {/* Recruiter Title Bar */}
              <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-sm border border-indigo-500/20">
                    💼
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200">Caro • Recruiting Portal</h3>
                    <p className="text-[10px] text-emerald-400 font-mono">● EN LÍNEA / SIMULACIÓN ACTIVA</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Entrevista</span>
                </div>
              </div>

              {/* Chat Dialogues */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-sm">
                {dialogs.map((dialog, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${dialog.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      dialog.sender === "user" 
                        ? "bg-indigo-600 text-indigo-50" 
                        : "bg-slate-950 border border-slate-800 text-slate-300"
                    }`}>
                      {dialog.text}
                    </div>
                  </motion.div>
                ))}

                {/* Loading state indicator for recruiter */}
                {userName !== "" && dialogs[dialogs.length - 1].sender === "user" && currentQuestionIdx < INTERVIEW_QUESTIONS.length && (
                  <div className="flex justify-start">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-500 font-mono">
                      Caro está analizando tu perfil...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Options or Free Text */}
              <div className="bg-slate-950/80 border-t border-slate-800 p-4">
                {userName === "" ? (
                  <form onSubmit={handleNameSubmit} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Escribe tu nombre y presiona Enter..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100"
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-xs font-semibold">
                      Enviar
                    </button>
                  </form>
                ) : (
                  <div className="space-y-2">
                    {currentQuestionIdx < INTERVIEW_QUESTIONS.length && dialogs[dialogs.length - 1].sender === "recruiter" && (
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Elige una respuesta táctica:</span>
                        {INTERVIEW_QUESTIONS[currentQuestionIdx].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleOptionSelect(opt)}
                            className="w-full text-left bg-slate-900 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-800/50 p-3 rounded-lg text-xs leading-relaxed transition text-slate-300 hover:text-slate-100"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: ANALYZING PROFILE */}
          {step === "RESULT" && (
            <motion.div
              key="result-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 shadow-2xl backdrop-blur-md"
            >
              <h2 className="text-xl font-bold font-sans text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                <Award className="w-5 h-5 text-emerald-400" />
                Matriz de Habilidades de {userName}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs font-mono text-slate-400 uppercase">Rigor Técnico</div>
                  <div className="text-2xl font-bold font-sans text-slate-100 mt-1">{skills[SkillType.TECHNICAL_RIGOR]}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${skills[SkillType.TECHNICAL_RIGOR]}%` }} />
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs font-mono text-slate-400 uppercase">Comunicación</div>
                  <div className="text-2xl font-bold font-sans text-slate-100 mt-1">{skills[SkillType.COMMUNICATION]}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${skills[SkillType.COMMUNICATION]}%` }} />
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs font-mono text-slate-400 uppercase">Adaptabilidad</div>
                  <div className="text-2xl font-bold font-sans text-slate-100 mt-1">{skills[SkillType.ADAPTABILITY]}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                    <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${skills[SkillType.ADAPTABILITY]}%` }} />
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs font-mono text-slate-400 uppercase">Confiabilidad</div>
                  <div className="text-2xl font-bold font-sans text-slate-100 mt-1">{skills[SkillType.RELIABILITY]}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${skills[SkillType.RELIABILITY]}%` }} />
                  </div>
                </div>
              </div>

              {/* Assignment Diagnosis */}
              <div className="bg-indigo-950/20 border border-indigo-500/30 p-5 rounded-xl mb-6">
                <h3 className="text-sm font-semibold text-indigo-300 uppercase font-mono mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  Asignación de Empresa y Equipo
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Basado en tu inclinación por la excelencia y resolución estratégica de problemas, has sido asignado/a como **Junior backend developer** en <strong className="text-slate-100">{assignedCompany.name}</strong> ({assignedCompany.industry}).
                </p>
                <div className="mt-4 flex gap-6 border-t border-slate-800 pt-4">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase">Tech Lead</span>
                    <span className="text-xs text-slate-300">{assignedCompany.techLead.avatar} {assignedCompany.techLead.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase">Product Owner</span>
                    <span className="text-xs text-slate-300">{assignedCompany.productOwner.avatar} {assignedCompany.productOwner.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase">Compañero Dev</span>
                    <span className="text-xs text-slate-300">{assignedCompany.peerDeveloper.avatar} {assignedCompany.peerDeveloper.name}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinishOnboarding}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-4 rounded-lg text-sm transition shadow-lg shadow-emerald-950/50"
              >
                Generar Correo de Contratación & Firmar Oferta →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
