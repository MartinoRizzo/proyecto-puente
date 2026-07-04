/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { SlackChannel, SlackMessage, Company, Actor } from "../types";
import { Send, Hash, Bell, Lock, UserCheck, MessageSquarePlus } from "lucide-react";
import { motion } from "motion/react";

interface SlackClientProps {
  channels: SlackChannel[];
  messages: { [channelId: string]: SlackMessage[] };
  activeChannelId: string;
  company: Company;
  userName: string;
  onSendMessage: (channelId: string, content: string) => void;
  onSelectChannel: (channelId: string) => void;
}

export default function SlackClient({
  channels,
  messages,
  activeChannelId,
  company,
  userName,
  onSendMessage,
  onSelectChannel,
}: SlackClientProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChannelId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(activeChannelId, inputText);
    setInputText("");
  };

  const getQuickReplies = () => {
    if (activeChannelId === "team-backend") {
      return [
        "Hola equipo, ¡muchas gracias por la bienvenida! Listo para el primer ticket.",
        "Ale, ya estoy revisando el bug de precisión en el servicio Ledger. ¿Tenemos pruebas unitarias existentes?",
        "Hola Martín, ¿dónde puedo encontrar la cadena de conexión de desarrollo para el Ledger?"
      ];
    }
    return [
      "¡Gracias a todos! Feliz de estar aquí.",
      "¡Excelente iniciativa!"
    ];
  };

  return (
    <div id="slack-client-container" className="grid grid-cols-1 md:grid-cols-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[600px] shadow-2xl">
      
      {/* Sidebar Channels */}
      <div className="bg-slate-950 flex flex-col h-full border-r border-slate-800">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 truncate">{company.name} Workspace</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">slack-enterprise // v4</p>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          <div className="px-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Canales</div>
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onSelectChannel(channel.id)}
              className={`w-full flex items-center justify-between px-4 py-2 text-xs transition ${
                activeChannelId === channel.id 
                  ? "bg-slate-900 text-slate-100 font-semibold" 
                  : "text-slate-400 hover:bg-slate-900/40"
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Hash className="w-3.5 h-3.5 text-slate-500" />
                {channel.name}
              </span>
              {channel.unread && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              )}
            </button>
          ))}
        </div>

        {/* Direct Teammates */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Compañeros activos</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 flex items-center gap-1.5">
                <span>{company.techLead.avatar}</span>
                {company.techLead.name} (TL)
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 flex items-center gap-1.5">
                <span>{company.peerDeveloper.avatar}</span>
                {company.peerDeveloper.name} (Dev)
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Feed */}
      <div className="col-span-3 flex flex-col h-full bg-slate-900/60">
        
        {/* Top Chat Bar */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-200">
              {channels.find((c) => c.id === activeChannelId)?.name || "channel"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <Bell className="w-3.5 h-3.5" />
            Notificaciones de canal activas
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[420px]">
          {messages[activeChannelId]?.map((msg) => (
            <div key={msg.id} className="flex gap-3 text-xs leading-relaxed">
              <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-sm shrink-0">
                {msg.senderAvatar}
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="font-semibold text-slate-200">{msg.senderName}</span>
                  <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-1.5 py-0.2 rounded uppercase font-mono tracking-wider scale-90">
                    {msg.senderRole}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                </div>
                <p className="text-slate-300">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestive Replies & Custom input */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800">
          
          {/* Quick Replies Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {getQuickReplies().map((reply, i) => (
              <button
                key={i}
                onClick={() => onSendMessage(activeChannelId, reply)}
                className="bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 text-[11px] px-3 py-1.5 rounded-lg transition text-left"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Custom Typing Area */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe un mensaje de chat aquí..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-100"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
