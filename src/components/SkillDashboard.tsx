/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SkillMatrix, SkillType } from "../types";
import { Award, ShieldAlert, Cpu, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface SkillDashboardProps {
  skills: SkillMatrix;
  history: { timestamp: string; description: string; impact: string }[];
}

export default function SkillDashboard({ skills, history }: SkillDashboardProps) {
  
  const getArchetype = () => {
    const rigor = skills[SkillType.TECHNICAL_RIGOR];
    const comms = skills[SkillType.COMMUNICATION];
    const adapt = skills[SkillType.ADAPTABILITY];
    
    if (rigor >= 70 && comms >= 65) {
      return {
        title: "Arquitecto de Rigor y Mentor",
        desc: "Priorizas soluciones con excelente robustez de diseño y mantienes una comunicación fluida y clara con el equipo de ingeniería."
      };
    } else if (adapt >= 70) {
      return {
        title: "Pragmático y Desarrollador Ágil",
        desc: "Te adaptas rápidamente a los cambios imprevistos de requerimientos y priorizas resolver problemas bloqueantes rápidamente."
      };
    } else {
      return {
        title: "Especialista Backend Estándar",
        desc: "Mantienes un balance saludable entre rigor técnico, confiabilidad y respeto por los flujos ágiles establecidos."
      };
    }
  };

  const archetype = getArchetype();

  return (
    <div id="skill-dashboard-root" className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] overflow-y-auto pr-2">
      
      {/* Metrics Section */}
      <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-indigo-400" />
            Learning Engine: Telemetría Cognitiva
          </h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Nuestros algoritmos evalúan tus decisiones situacionales y hábitos de código para trazar tu crecimiento profesional en tiempo real.
          </p>

          <div className="space-y-5">
            {/* Rigor */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Rigor Técnico (Technical Rigor)</span>
                <span className="font-mono text-indigo-400 font-bold">{skills[SkillType.TECHNICAL_RIGOR]}%</span>
              </div>
              <div className="w-full bg-slate-950 border border-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${skills[SkillType.TECHNICAL_RIGOR]}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Uso de BigDecimal, manejo de concurrencia y validación estricta de tests.</p>
            </div>

            {/* Comms */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Comunicación (Communication)</span>
                <span className="font-mono text-emerald-400 font-bold">{skills[SkillType.COMMUNICATION]}%</span>
              </div>
              <div className="w-full bg-slate-950 border border-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${skills[SkillType.COMMUNICATION]}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Escribir documentación, reportes de incidentes de producción y responder en Slack.</p>
            </div>

            {/* Adaptabilidad */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Adaptabilidad (Adaptability)</span>
                <span className="font-mono text-sky-400 font-bold">{skills[SkillType.ADAPTABILITY]}%</span>
              </div>
              <div className="w-full bg-slate-950 border border-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full transition-all duration-500" style={{ width: `${skills[SkillType.ADAPTABILITY]}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Capacidad para absorber cambios repentinos en medio de sprints congelados.</p>
            </div>

            {/* Confiabilidad */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Confiabilidad (Reliability)</span>
                <span className="font-mono text-amber-400 font-bold">{skills[SkillType.RELIABILITY]}%</span>
              </div>
              <div className="w-full bg-slate-950 border border-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${skills[SkillType.RELIABILITY]}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Escribir pruebas unitarias exhaustivas y cumplir con deadlines virtuales.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Archetype Analysis */}
        <div className="mt-6 border border-slate-800 bg-slate-950 p-4 rounded-xl">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-1">Perfil Arquetípico Analizado</span>
          <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-500" />
            {archetype.title}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{archetype.desc}</p>
        </div>
      </div>

      {/* History Event Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-800 pb-3">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Registro Histórico de Impacto
        </h3>

        <div className="flex-1 overflow-y-auto space-y-3 mt-4 pr-1">
          {history.length > 0 ? (
            history.map((evt, i) => (
              <div key={i} className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-xs flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono text-slate-500">{evt.timestamp}</span>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                    {evt.impact}
                  </span>
                </div>
                <p className="text-slate-300 leading-snug">{evt.description}</p>
              </div>
            ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-xs text-center border border-dashed border-slate-800 rounded-lg p-4">
              Realiza acciones en el Workspace (chat, commits, firma de contrato) para ver el registro histórico de impacto.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
