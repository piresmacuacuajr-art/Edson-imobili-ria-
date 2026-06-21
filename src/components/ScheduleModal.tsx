/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, X } from 'lucide-react';
import { Property } from '../types';

interface ScheduleModalProps {
  property: Property | null;
  onClose: () => void;
  onConfirmSchedule: (scheduleData: {
    propertyId: string;
    propertyName: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    date: string;
    time: string;
    message: string;
  }) => void;
}

export default function ScheduleModal({ property, onClose, onConfirmSchedule }: ScheduleModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 - Manhã');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMode, setSuccessMode] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName || !clientEmail || !clientPhone || !date) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    // Prepare simulated schedule data
    onConfirmSchedule({
      propertyId: property?.id || 'contactos-geral',
      propertyName: property?.title || 'Contacto Geral de Consultoria',
      clientName,
      clientEmail,
      clientPhone,
      date,
      time,
      message
    });

    // Generate a beautiful unique mock alpha-numeric ticket number
    const randomTicket = 'GESV-' + Math.floor(100000 + Math.random() * 900000);
    setTicketNumber(randomTicket);
    setSuccessMode(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans" id="physical-visit-scheduler">
      <div className="bg-slate-900 border border-[#d4af37]/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-scale-up text-left">
        
        {/* Close Top Corner Option */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {successMode ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Visita Pré-Agendada!</h3>
              <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
                Excelente escolha, {clientName}! Detalhes registados sob o ticket de consulta de imobiliárias <strong>{ticketNumber}</strong>.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 border border-white/5 rounded-xl text-left space-y-2">
              <div className="text-[11px] font-mono text-gray-400 flex justify-between">
                <span>Imóvel de Interesse:</span>
                <span className="font-bold text-[#d4af37] text-right max-w-[200px] truncate">{property?.title || 'Consulta de Portfólio Geral'}</span>
              </div>
              <div className="text-[11px] font-mono text-gray-400 flex justify-between">
                <span>Data Escolhida:</span>
                <span className="font-bold text-white">{date}</span>
              </div>
              <div className="text-[11px] font-mono text-gray-400 flex justify-between">
                <span>Horário Selecionado:</span>
                <span className="font-bold text-white">{time}</span>
              </div>
              <div className="text-[11px] font-mono text-gray-400 flex justify-between">
                <span>Responsável:</span>
                <span className="font-bold text-amber-400">Equipa Grupo Edson</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-500 max-w-xs mx-auto">
              Enviámos um SMS de lembrança para <strong>{clientPhone}</strong>. Por favor, aguarde o contacto do nosso corretor no WhatsApp para o envio da localização precisa pelo mapa.
            </p>

            <button
              onClick={onClose}
              className="bg-[#d4af37] text-slate-900 font-extrabold px-6 py-2 rounded-lg text-xs hover:bg-yellow-500 transition"
            >
              Compreendido, Fechar Janela
            </button>
          </div>
        ) : (
          <div>
            {/* Header portion */}
            <div className="p-6 bg-slate-950/40 border-b border-white/5">
              <h3 className="text-base font-extrabold text-[#d4af37] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#d4af37]" />
                Agendar Visita Física Online
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {property 
                  ? `Selecione um horário para visitar: "${property.title}"` 
                  : 'Fale com os nossos especialistas e faça um tour pelo portfólio.'}
              </p>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="m-6 mb-0 p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-red-200 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Nome Completo *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Eunice Tembe"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium">Melhor Contacto *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +258 84 956 5078"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium">E-mail de Contacto *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium">Data Pretendida *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:border-[#d4af37] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-medium">Período Selecionado</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="09:00 - Manhã">09:00 - Manhã</option>
                    <option value="11:00 - Manhã">11:00 - Manhã (Recomendado)</option>
                    <option value="14:00 - Tarde">14:00 - Tarde</option>
                    <option value="16:00 - Tarde">16:00 - Tarde</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-medium">Mensagem Adicional / Requisitos Especiais</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Gostaria de confirmar se é possível agendar ao sábado ou se aceitam animais domésticos."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#d4af37] focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa841b] text-slate-900 font-extrabold py-3 rounded-xl hover:brightness-110 transition text-xs shadow-lg"
              >
                Confirmar Agendamento de Visita
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
