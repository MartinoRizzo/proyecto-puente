/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Company, Email, SlackChannel, SlackMessage, Ticket, PullRequest, SkillMatrix, SkillType } from "../types";
import { Mail, MessageSquare, Layers, Code, Cpu, LogOut, Sparkles, Building2, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import EmailClient from "./EmailClient";
import SlackClient from "./SlackClient";
import JiraBoard from "./JiraBoard";
import GitWorkspace from "./GitWorkspace";
import SkillDashboard from "./SkillDashboard";
import { INITIAL_TICKETS } from "../data/companies";

interface WorkplaceProps {
  company: Company;
  userName: string;
  userEmail: string;
  initialSkills: SkillMatrix;
  onLogout: () => void;
}

export default function Workplace({ company, userName, userEmail, initialSkills, onLogout }: WorkplaceProps) {
  const [activeTab, setActiveTab] = useState<"EMAIL" | "CHAT" | "JIRA" | "CODE" | "METRICS">("EMAIL");
  const [signedContract, setSignedContract] = useState(false);
  const [skills, setSkills] = useState<SkillMatrix>(initialSkills);
  
  // Interaction and Learning logs
  const [history, setHistory] = useState<{ timestamp: string; description: string; impact: string }[]>([]);

  // Simulation states
  const [emails, setEmails] = useState<Email[]>([]);
  const [slackChannels, setSlackChannels] = useState<SlackChannel[]>([]);
  const [slackMessages, setSlackMessages] = useState<{ [channelId: string]: SlackMessage[] }>({});
  const [activeChannelId, setActiveChannelId] = useState("general");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pullRequest, setPullRequest] = useState<PullRequest | null>(null);
  
  // Game state milestones
  const [ticketStarted, setTicketStarted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Helper to log changes to the Learning Engine
  const logImpact = (description: string, impactStr: string) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setHistory((prev) => [
      { timestamp: time, description, impact: impactStr },
      ...prev
    ]);
  };

  // Initialize workspace based on company
  useEffect(() => {
    // 1. Initial Contract Email
    setEmails([
      {
        id: "contract-email",
        sender: "Caro (Talent Acquisition)",
        senderRole: "Recruiting Manager",
        subject: `¡Felicidades! Oferta Formal de Empleo en ${company.name}`,
        body: `Hola ${userName},\n\nEs un placer para mí extenderte esta oferta formal para unirte a ${company.name} como Junior Backend Developer.\n\nTodo nuestro equipo quedó sumamente impresionado por tu enfoque situacional en la entrevista técnica y tu madurez para equilibrar el rigor del diseño y las necesidades del negocio.\n\nAdjunto a este correo encontrarás los detalles de tu compensación, periodo de prueba y las políticas de la compañía. Por favor, lee atentamente el contrato virtual adjunto y fírmalo electrónicamente para dar inicio formal a tu primer día laboral.\n\n¡Esperamos ansiosos comenzar este puente técnico juntos!\n\nSaludos cordiales,\nCaro`,
        timestamp: "09:00 AM",
        read: false,
        hasAttachment: true
      }
    ]);

    // 2. Initial Channels
    setSlackChannels([
      { id: "general", name: "general", unread: false },
      { id: "team-backend", name: "team-backend", unread: false }
    ]);

    // 3. Initial Messages
    setSlackMessages({
      "general": [
        {
          id: "sys-1",
          senderId: "system",
          senderName: "BridgeBot",
          senderRole: "SYSTEM",
          senderAvatar: "🤖",
          content: `Bienvenido/a al espacio oficial de Slack de ${company.name}.`,
          timestamp: "09:00 AM"
        }
      ],
      "team-backend": []
    });

    // 4. Initial tickets
    setTickets(INITIAL_TICKETS[company.id] || []);

  }, [company, userName]);

  // Handler for Signing Contract (Step 4 & Day 1 Trigger)
  const handleSignContract = () => {
    setSignedContract(true);
    logImpact("Contrato firmado electrónicamente", "CONTRATADO");

    // Push new emails
    setEmails((prev) => [
      ...prev,
      {
        id: "onboarding-creds",
        sender: `${company.techLead.name}`,
        senderRole: "Tech Lead",
        subject: "Puesta a punto (Onboarding) y credenciales de desarrollo",
        body: `Hola ${userName}, ¡bienvenido al equipo de ingeniería!\n\nAcabo de dar de alta tu correo en AWS y en la base de datos PostgreSQL de desarrollo. También te asigné los repositorios clave en nuestro hosting de Git.\n\nPara el día de hoy, me gustaría que:\n1. Te presentes en el canal de Slack #team-backend.\n2. Revises nuestro tablero de Jira en busca de tu primer ticket de inducción.\n\nEstamos trabajando en resolver una serie de issues técnicas críticas de cara a la auditoría de fin de mes, así que cualquier ayuda sumará un montón.\n\n¡Éxitos! Cualquier duda, estoy en Slack.\n\n---\nAlejandro Silva\nTech Lead, Core Backend`,
        timestamp: "09:05 AM",
        read: false
      },
      {
        id: "sprint-launch",
        sender: `${company.productOwner.name}`,
        senderRole: "Product Owner",
        subject: "Sprint 1: Estabilización de entregables críticos",
        body: `Equipo,\n\nIniciamos de forma oficial el Sprint 1. El cliente está auditando con lupa el rendimiento y la precisión de nuestros servicios centrales.\n\nPor favor, enfoquémonos en resolver las tareas del backlog de mayor severidad. El ticket técnico principal ya fue priorizado y está en la columna de To Do asignado a nuestro nuevo refuerzo backend, ${userName}.\n\n¡A romperla!\n\nSofía Martínez\nProduct Owner`,
        timestamp: "09:06 AM",
        read: false
      }
    ]);

    // Push Slack conversations introducing teammates
    setSlackMessages((prev) => ({
      ...prev,
      "general": [
        ...prev["general"],
        {
          id: "g-1",
          senderId: company.productOwner.id,
          senderName: company.productOwner.name,
          senderRole: "Product Owner",
          senderAvatar: company.productOwner.avatar,
          content: `¡Chicos, démosle una calurosa bienvenida a ${userName}! Hoy se suma como Junior Backend Developer en nuestro equipo. ¡Un placer tenerte con nosotros! 🎉`,
          timestamp: "09:10 AM"
        },
        {
          id: "g-2",
          senderId: company.peerDeveloper.id,
          senderName: company.peerDeveloper.name,
          senderRole: "Software Engineer",
          senderAvatar: company.peerDeveloper.avatar,
          content: `¡Bienvenido/a ${userName}! Qué bueno sumar otra mano al backend de Core-Services. 💻☕`,
          timestamp: "09:11 AM"
        }
      ],
      "team-backend": [
        {
          id: "tb-1",
          senderId: company.techLead.id,
          senderName: company.techLead.name,
          senderRole: "Tech Lead",
          senderAvatar: company.techLead.avatar,
          content: `Hola ${userName}, espero que estés cómodo/a. Te dejé un ticket listo para ti en Jira. Trata de revisar el código base de desarrollo. Es una issue bastante importante sobre precisión que nos está quemando las papas. ¡Cualquier duda avísanos por acá!`,
          timestamp: "09:12 AM"
        }
      ]
    }));

    // Trigger notification indicators
    setSlackChannels((prev) =>
      prev.map((ch) => (ch.id === "general" || ch.id === "team-backend" ? { ...ch, unread: true } : ch))
    );

    // Swap to Slack Chat automatically so they feel the transition of "Day 1"!
    setActiveTab("CHAT");
  };

  const handleReadEmail = (id: string) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, read: true } : e)));
  };

  const handleSelectChannel = (id: string) => {
    setActiveChannelId(id);
    setSlackChannels((prev) => prev.map((ch) => (ch.id === id ? { ...ch, unread: false } : ch)));
  };

  // Chat message sending and responsive AI simulator trigger
  const handleSendMessage = (channelId: string, content: string) => {
    const newMessage: SlackMessage = {
      id: `msg-${Date.now()}`,
      senderId: "user",
      senderName: userName,
      senderRole: "Junior Developer",
      senderAvatar: "🤓",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setSlackMessages((prev) => ({
      ...prev,
      [channelId]: [...prev[channelId], newMessage]
    }));

    logImpact(`Mensaje enviado a #${channelId}`, "+COMUNICACIÓN");
    setSkills((prev) => ({ ...prev, [SkillType.COMMUNICATION]: Math.min(100, prev[SkillType.COMMUNICATION] + 5) }));

    // Simulate reactive responses based on user content
    setTimeout(() => {
      let replyContent = "";
      let sender: typeof company.techLead = company.techLead;

      if (channelId === "team-backend") {
        if (content.includes("Ledger") || content.includes("ticket") || content.includes("bug")) {
          replyContent = `Buenísimo, ${userName}. Sí, ese LedgerService tiene un problema de precisión crítico con Doubles. En producción, la diferencia de centavos nos arruina la auditoría bancaria. Revisa el código en el editor Git y propón la migración a BigDecimal.`;
          sender = company.techLead;
        } else if (content.includes("bienvenida") || content.includes("gracias")) {
          replyContent = `¡De nada ${userName}! Te vas a acostumbrar rápido al ritmo. Martín o yo estamos a un ping si te trabas en el setup de PostgreSQL local. ¡A darle!`;
          sender = company.peerDeveloper;
        } else {
          replyContent = `De acuerdo, mantengámonos enfocados en Jira. Cualquier update de tu PR avísanos para agilizar el code review.`;
          sender = company.techLead;
        }

        const replyMsg: SlackMessage = {
          id: `reply-${Date.now()}`,
          senderId: sender.id,
          senderName: sender.name,
          senderRole: sender.role === "TECH_LEAD" ? "Tech Lead" : "Software Engineer",
          senderAvatar: sender.avatar,
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };

        setSlackMessages((prev) => ({
          ...prev,
          "team-backend": [...prev["team-backend"], replyMsg]
        }));
      }
    }, 1500);
  };

  // Triggered when user starts working on their first ticket (Step 6)
  const handleStartTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "IN_PROGRESS" } : t))
    );
    setTicketStarted(true);
    logImpact(`Iniciaste trabajo en el ticket ${ticketId}`, "+CONFIABILIDAD");
    setSkills((prev) => ({ ...prev, [SkillType.RELIABILITY]: Math.min(100, prev[SkillType.RELIABILITY] + 10) }));

    // Send a real-time slack notification from the Tech Lead
    setSlackMessages((prev) => ({
      ...prev,
      "team-backend": [
        ...prev["team-backend"],
        {
          id: `sys-notif-${Date.now()}`,
          senderId: company.techLead.id,
          senderName: company.techLead.name,
          senderRole: "Tech Lead",
          senderAvatar: company.techLead.avatar,
          content: `¡Excelente! Veo que ya asignaste el ticket ${ticketId} a 'In Progress' en Jira. Eso notifica automáticamente a la base de datos de auditoría. El editor de código ya está desbloqueado en tu panel de Git. ¡A programar!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]
    }));

    setSlackChannels((prev) =>
      prev.map((ch) => (ch.id === "team-backend" ? { ...ch, unread: true } : ch))
    );

    // Focus on code tab
    setActiveTab("CODE");
  };

  // Triggered when user submits a Pull Request (Step 7)
  const handleSubmitPR = (
    prTitle: string,
    branchName: string,
    selectedChoice: string,
    codeDiff: { file: string; additions: string[]; deletions: string[] }[]
  ) => {
    // Create actual PR
    const newPR: PullRequest = {
      id: "42",
      ticketId: tickets[0].id,
      title: prTitle,
      branchName,
      codeChanges: codeDiff,
      comments: [],
      status: "OPEN"
    };

    setPullRequest(newPR);
    setTickets((prev) =>
      prev.map((t) => (t.status === "IN_PROGRESS" ? { ...t, status: "IN_REVIEW" } : t))
    );

    logImpact(`Pull Request #${newPR.id} abierto`, "PULL_REQUEST_ABIERTO");

    // Push Slack notification about PR
    setSlackMessages((prev) => ({
      ...prev,
      "team-backend": [
        ...prev["team-backend"],
        {
          id: `pr-notif-${Date.now()}`,
          senderId: "user",
          senderName: userName,
          senderRole: "Junior Developer",
          senderAvatar: "🤓",
          content: `Acabo de abrir un Pull Request para solucionar el ticket de precisión en la rama: ${branchName}. Quedo atento a sus comentarios.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]
    }));

    // Trigger Code reviews on a small delay (Step 8)
    setTimeout(() => {
      let tlComment = "";
      let peerComment = "";
      let updatedStatus: PullRequest["status"] = "OPEN";

      if (selectedChoice === "choice-b") {
        // Correct Choice
        tlComment = `¡Brillante, ${userName}! Configurar BigDecimal con escala 2 y HALF_EVEN es exactamente lo que el equipo de auditoría requería. Es limpio, mantenible y evita la pérdida de precisión monetaria de coma flotante. Apruebo y doy mi LGTM (Looks Good To Me). ¡Felicitaciones por tu primer gran código!`;
        peerComment = `Excelente trabajo, ${userName}. Yo casi subo un hotfix con float el sprint anterior, menos mal que entraste tú con este rigor. ¡Apruebo también!`;
        updatedStatus = "APPROVED";
      } else if (selectedChoice === "choice-c") {
        // Suboptimal Choice
        tlComment = `Buen intento, ${userName}. Pero usar truncamiento tosco mediante casteo int sigue perdiendo precisión sistemática en las auditorías contables. Te sugiero investigar BigDecimal con RoundingMode para cálculos monetarios rigurosos.`;
        peerComment = `Coincido con Ale. En Fintech el redondeo bancario es vital. Por favor dale otra vuelta al editor para corregirlo.`;
        updatedStatus = "CHANGES_REQUESTED";
      } else {
        // Wrong Choice
        tlComment = `Hola ${userName}. Veo que cambiaste a Float. Float sufre exactamente de los mismos problemas de redondeo que Double en la JVM. Esto romperá la conciliación bancaria regulatoria en AuraPay. Debes migrar todo el flujo matemático a BigDecimal de forma obligatoria.`;
        peerComment = `¡Uff! Sí, usar Float para dinero es un anti-patrón de seguridad crítico. Te sugiero rehacer el PR con BigDecimal.`;
        updatedStatus = "CHANGES_REQUESTED";
      }

      setPullRequest((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: updatedStatus,
          comments: [
            {
              actorId: company.peerDeveloper.id,
              actorName: company.peerDeveloper.name,
              avatar: company.peerDeveloper.avatar,
              content: peerComment,
              timestamp: "Hace 1 min"
            },
            {
              actorId: company.techLead.id,
              actorName: company.techLead.name,
              avatar: company.techLead.avatar,
              content: tlComment,
              timestamp: "Hace unos segundos"
            }
          ]
        };
      });

      // Send to Slack too
      setSlackMessages((prev) => ({
        ...prev,
        "team-backend": [
          ...prev["team-backend"],
          {
            id: `pr-tl-slack-${Date.now()}`,
            senderId: company.techLead.id,
            senderName: company.techLead.name,
            senderRole: "Tech Lead",
            senderAvatar: company.techLead.avatar,
            content: updatedStatus === "APPROVED" 
              ? `¡Excelente PR #${newPR.id} de redondeo, ${userName}! Ya dejé mi aprobación formal en GitHub. Cuando puedas, dale al botón de 'Merge' para combinarlo a master y desplegar a staging.`
              : `Hola ${userName}, te dejé unos comentarios técnicos con cambios solicitados (Blocker) en tu PR. Dale una mirada cuando puedas para corregir la precisión.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]
      }));

      // Set badge on Slack backend
      setSlackChannels((prev) =>
        prev.map((ch) => (ch.id === "team-backend" ? { ...ch, unread: true } : ch))
      );

    }, 2000);
  };

  // Merge PR and show the grand finale celebration
  const handleApproveAndMerge = (updatedSkills: Partial<SkillMatrix>) => {
    setTickets((prev) =>
      prev.map((t) => (t.status === "IN_REVIEW" ? { ...t, status: "DONE" } : t))
    );
    setPullRequest((prev) => (prev ? { ...prev, status: "MERGED" } : null));
    
    setSkills((prev) => {
      const next = { ...prev };
      Object.entries(updatedSkills).forEach(([key, val]) => {
        const k = key as SkillType;
        next[k] = Math.min(100, next[k] + (val || 0));
      });
      return next;
    });

    logImpact("Pull Request mezclado en master", "COMPLETADO");
    logImpact("Despliegue automático a Staging pasando tests: OK", "STAGING_LIVE");

    setTimeout(() => {
      setShowCelebration(true);
    }, 1500);
  };

  return (
    <div id="workplace-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30">
      
      {/* Workspace Header Topbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <div>
            <h1 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              Proyecto Puente
              <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded font-mono font-medium uppercase tracking-wider">
                Workspace
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              Empresa asignada: <strong className="text-slate-300">{company.name}</strong> ({company.industry})
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        {signedContract && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab("EMAIL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
                activeTab === "EMAIL" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Emails
            </button>
            <button
              onClick={() => setActiveTab("CHAT")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition relative ${
                activeTab === "CHAT" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Slack
              {slackChannels.some((c) => c.unread) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-slate-900" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("JIRA")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
                activeTab === "JIRA" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Jira
            </button>
            <button
              onClick={() => setActiveTab("CODE")}
              disabled={!ticketStarted}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition disabled:opacity-40 ${
                activeTab === "CODE" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Git Editor
            </button>
            <button
              onClick={() => setActiveTab("METRICS")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition ${
                activeTab === "METRICS" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Learning Engine
            </button>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-200">{userName}</span>
            <span className="text-[10px] font-mono text-slate-500">{userEmail}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-slate-500 hover:text-rose-400 p-2 rounded-lg transition"
            title="Salir de la simulación"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Stage */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Onboarding block message if contract unsigned */}
        {!signedContract ? (
          <div className="space-y-6">
            <div className="bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-xl text-xs text-indigo-300 font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 animate-pulse" />
              SISTEMA: Tu firma electrónica es requerida para activar los canales de Slack, Jira y Git Editor.
            </div>
            <EmailClient
              emails={emails}
              company={company}
              userName={userName}
              onSignOffer={handleSignContract}
              onReadEmail={handleReadEmail}
            />
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Mobile navigation tab warning */}
            <div className="md:hidden flex flex-wrap gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
              <button onClick={() => setActiveTab("EMAIL")} className={`flex-1 text-center py-2 rounded text-xs font-mono ${activeTab === "EMAIL" ? "bg-indigo-600 text-white" : "text-slate-400"}`}>Mail</button>
              <button onClick={() => setActiveTab("CHAT")} className={`flex-1 text-center py-2 rounded text-xs font-mono ${activeTab === "CHAT" ? "bg-indigo-600 text-white" : "text-slate-400"}`}>Slack</button>
              <button onClick={() => setActiveTab("JIRA")} className={`flex-1 text-center py-2 rounded text-xs font-mono ${activeTab === "JIRA" ? "bg-indigo-600 text-white" : "text-slate-400"}`}>Jira</button>
              <button onClick={() => setActiveTab("CODE")} disabled={!ticketStarted} className={`flex-1 text-center py-2 rounded text-xs font-mono ${activeTab === "CODE" ? "bg-indigo-600 text-white" : "text-slate-400 disabled:opacity-40"}`}>Git</button>
              <button onClick={() => setActiveTab("METRICS")} className={`flex-1 text-center py-2 rounded text-xs font-mono ${activeTab === "METRICS" ? "bg-indigo-600 text-white" : "text-slate-400"}`}>Stats</button>
            </div>

            {/* Dynamic tabs views */}
            <AnimatePresence mode="wait">
              {activeTab === "EMAIL" && (
                <motion.div key="emails" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <EmailClient emails={emails} company={company} userName={userName} onSignOffer={handleSignContract} onReadEmail={handleReadEmail} />
                </motion.div>
              )}

              {activeTab === "CHAT" && (
                <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <SlackClient channels={slackChannels} messages={slackMessages} activeChannelId={activeChannelId} company={company} userName={userName} onSendMessage={handleSendMessage} onSelectChannel={handleSelectChannel} />
                </motion.div>
              )}

              {activeTab === "JIRA" && (
                <motion.div key="jira" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <JiraBoard tickets={tickets} company={company} onStartTicket={handleStartTicket} />
                </motion.div>
              )}

              {activeTab === "CODE" && ticketStarted && (
                <motion.div key="code" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <GitWorkspace company={company} activeTicket={tickets[0]} onSubmitPR={handleSubmitPR} pullRequest={pullRequest} onApproveAndMerge={handleApproveAndMerge} />
                </motion.div>
              )}

              {activeTab === "METRICS" && (
                <motion.div key="metrics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <SkillDashboard skills={skills} history={history} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto py-6 bg-slate-900 border-t border-slate-800 text-center text-[10px] font-mono text-slate-500">
        PROYECTO PUENTE INC. // TODOS LOS DERECHOS RESERVADOS COFUNDADORES © 2026
      </footer>

      {/* GRAND FINALE CELEBRATION MODAL */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-indigo-500/30 p-8 rounded-2xl max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
            >
              {/* Decorative sparkles */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-3xl mb-6">
                🚀
              </div>

              <h2 className="text-2xl font-bold text-slate-100 font-sans tracking-tight">
                ¡Primer PR fusionado con éxito!
              </h2>
              <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-wider text-emerald-400">
                PRODUCCIÓN ACTUALIZADA // CERO ERRORES
              </p>

              <p className="text-xs text-slate-300 leading-relaxed mt-4">
                Felicitaciones <strong>{userName}</strong>. Has completado con éxito tu primer día laboral simulado en <strong>{company.name}</strong>. Resolviste una issue real de precisión utilizando buenas prácticas y convenciste a tu Tech Lead en el Code Review.
              </p>

              {/* Metrics Summary inside popup */}
              <div className="my-6 p-4 bg-slate-950 border border-slate-850 rounded-xl text-left">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-3">Tus métricas de Learning Engine actualizadas:</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Rigor Técnico:</span>
                    <strong className="text-indigo-400 text-sm font-mono">{skills[SkillType.TECHNICAL_RIGOR]}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Comunicación:</span>
                    <strong className="text-emerald-400 text-sm font-mono">{skills[SkillType.COMMUNICATION]}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Confiabilidad:</span>
                    <strong className="text-amber-400 text-sm font-mono">{skills[SkillType.RELIABILITY]}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Adaptabilidad:</span>
                    <strong className="text-sky-400 text-sm font-mono">{skills[SkillType.ADAPTABILITY]}%</strong>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowCelebration(false);
                    setActiveTab("METRICS");
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs py-3 rounded-lg transition"
                >
                  Ver Reporte Completo
                </button>
                <button
                  onClick={onLogout}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs py-3 rounded-lg transition font-bold"
                >
                  Iniciar Otra Simulación
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
