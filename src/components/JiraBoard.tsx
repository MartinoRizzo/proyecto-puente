/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Ticket, Company } from "../types";
import { Calendar, CheckSquare, Layers, Clock, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface JiraBoardProps {
  tickets: Ticket[];
  company: Company;
  onStartTicket: (ticketId: string) => void;
}

export default function JiraBoard({ tickets, company, onStartTicket }: JiraBoardProps) {
  const getStatusColumnTitle = (status: Ticket["status"]) => {
    switch (status) {
      case "BACKLOG": return "Backlog";
      case "TODO": return "Por Hacer (To Do)";
      case "IN_PROGRESS": return "En Progreso";
      case "IN_REVIEW": return "En Revisión (Code Review)";
      case "DONE": return "Completado (Done)";
    }
  };

  const columns: Ticket["status"][] = ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

  return (
    <div id="jira-board-root" className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[600px] shadow-2xl p-6">
      
      {/* Board Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Tablero Scrum de {company.name}
          </h2>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">Sprint Activo 1 // Proyecto: Core-Services</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" />
            3 días restantes
          </span>
        </div>
      </div>

      {/* Board Grid Columns */}
      <div className="flex-1 grid grid-cols-5 gap-3 overflow-x-auto">
        {columns.map((column) => {
          const columnTickets = tickets.filter((t) => t.status === column);
          return (
            <div key={column} className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 flex flex-col h-full min-w-[200px]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wide truncate">
                  {getStatusColumnTitle(column)}
                </span>
                <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {columnTickets.length}
                </span>
              </div>

              {/* Tickets List inside Column */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {columnTickets.length > 0 ? (
                  columnTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-3 shadow transition flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                          {ticket.id}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                          ticket.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400" :
                          ticket.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400" :
                          "bg-rose-500/10 text-rose-400"
                        }`}>
                          {ticket.difficulty}
                        </span>
                      </div>
                      
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug mb-2">
                        {ticket.title}
                      </h4>
                      
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {ticket.description}
                      </p>

                      <div className="mt-auto pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-slate-500">
                          {ticket.points} SP (Story Points)
                        </span>
                        {column === "TODO" && (
                          <button
                            onClick={() => onStartTicket(ticket.id)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-bold px-2 py-1 rounded transition"
                          >
                            Iniciar Trabajo →
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800/40 rounded-lg p-4 text-center text-slate-600 text-[10px]">
                    Sin tareas
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
