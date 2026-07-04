/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Email, Company } from "../types";
import { Mail, ArrowRight, ShieldCheck, MailOpen, FileText } from "lucide-react";
import { motion } from "motion/react";

interface EmailClientProps {
  emails: Email[];
  company: Company;
  userName: string;
  onSignOffer: () => void;
  onReadEmail: (id: string) => void;
}

export default function EmailClient({ emails, company, userName, onSignOffer, onReadEmail }: EmailClientProps) {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0]?.id || "");
  const [isSigned, setIsSigned] = useState(false);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId);

  const handleSign = () => {
    setIsSigned(true);
    onSignOffer();
  };

  return (
    <div id="email-client-container" className="grid grid-cols-1 md:grid-cols-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[600px] shadow-2xl">
      
      {/* Email List Sidebar */}
      <div className="border-r border-slate-800 flex flex-col h-full bg-slate-950/40">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Inbox simulado</span>
          <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono px-2 py-0.5 rounded">
            {emails.filter((e) => !e.read).length} no leídos
          </span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-900">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => {
                setSelectedEmailId(email.id);
                onReadEmail(email.id);
              }}
              className={`w-full text-left p-4 hover:bg-slate-900/60 transition relative ${
                selectedEmailId === email.id ? "bg-slate-900/80 border-l-2 border-indigo-500" : ""
              } ${!email.read ? "font-semibold text-slate-100" : "text-slate-400"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-indigo-400 font-mono truncate max-w-[120px]">{email.sender}</span>
                <span className="text-[10px] text-slate-500 font-mono">{email.timestamp}</span>
              </div>
              <h4 className="text-xs font-medium text-slate-200 truncate mb-1">{email.subject}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">{email.body}</p>
              {!email.read && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Email Reader View */}
      <div className="col-span-2 flex flex-col h-full bg-slate-900">
        {selectedEmail ? (
          <div className="flex flex-col h-full p-6">
            <div className="border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg">
                  ✉️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{selectedEmail.subject}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    De: <span className="text-indigo-400 font-mono">{selectedEmail.sender}</span> ({selectedEmail.senderRole})
                  </p>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="flex-1 overflow-y-auto text-xs text-slate-300 leading-relaxed space-y-4 font-sans max-h-[380px] pr-2">
              <div className="whitespace-pre-wrap">{selectedEmail.body}</div>

              {/* Special interactive logic for Contract Email */}
              {selectedEmail.id === "contract-email" && (
                <div className="mt-8 border border-slate-800 bg-slate-950/60 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono uppercase mb-3">
                    <ShieldCheck className="w-4 h-4" />
                    CONTRATO LABORAL ADJUNTO
                  </div>
                  <ul className="text-[11px] space-y-2 text-slate-400 mb-4 list-disc list-inside">
                    <li>Puesto: <span className="text-slate-200 font-semibold">Junior Backend Developer - {company.name}</span></li>
                    <li>Sueldo Simulado: <span className="text-slate-200 font-semibold">$3,500 USD/mes</span></li>
                    <li>Periodo de Prueba: <span className="text-slate-200 font-semibold">3 Meses</span></li>
                    <li>Días de trabajo: <span className="text-slate-200 font-semibold">Lunes a Viernes (Simulado)</span></li>
                  </ul>

                  {!isSigned ? (
                    <button
                      onClick={handleSign}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 text-xs rounded-lg transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Firmar Contrato y Acceder al Workspace
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono">
                      ✓ CONTRATO FIRMADO ELECTRÓNICAMENTE POR {userName.toUpperCase()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
            <MailOpen className="w-8 h-8 text-slate-700 mb-2" />
            <span className="text-xs font-mono">Selecciona un correo para leer</span>
          </div>
        )}
      </div>
    </div>
  );
}
