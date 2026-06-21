/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ArrowRight, Bot, User, CheckCheck } from 'lucide-react';
import { ChatMessage } from '../types';

export default function ChatOnline() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-start',
      sender: 'agent',
      text: 'Olá! Sou o assistente virtual do Grupo Edson Imobiliária. Como posso ajudar nas suas conquistas de investimento em Moçambique hoje?',
      timestamp: 'Falar com Atendente'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest chat item
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulated customized AI responses based on text inputs
    setTimeout(() => {
      let responseText = '';
      const textLower = textToSend.toLowerCase();

      if (textLower.includes('visita') || textLower.includes('agendar') || textLower.includes('marca')) {
        responseText = 'Excelente escolha! Pode agendar a sua visita física online diretamente no menu "Contactos" ou preenchendo a ficha no imóvel que lhe agradou. Alternativamente, ligue para +258 84 956 5078 ou envie WhatsApp para +258 87 956 5078 para confirmação imediata.';
      } else if (textLower.includes('venda') || textLower.includes('anunciar') || textLower.includes('proprietário')) {
        responseText = 'Para anunciar o seu imóvel connosco (Vivendas, Apartamentos ou Terrenos), use o nosso formulário no menu "Anuncie seu Imóvel". É totalmente gratuito e cuidamos da publicidade premium no Google!';
      } else if (textLower.includes('juro') || textLower.includes('juro') || textLower.includes('simulador') || textLower.includes('financiamento')) {
        responseText = 'Dispomos de um Simulador de Financiamento avançado abaixo da secção de catálogo de imóveis. Basta inserir o preço da vivenda desejada e avaliar as prestações estimadas!';
      } else if (textLower.includes('duat') || textLower.includes('documento') || textLower.includes('legalizar')) {
        responseText = 'Analisamos toda a documentação (DUAT, Registo Predial e Certidão Negativa de Impostos) de modo a evitar burlas. Pode ler o nosso guia detalhado no "Blog" da página!';
      } else if (textLower.includes('matola') || textLower.includes('maputo') || textLower.includes('sommerschield')) {
        responseText = 'Temos excelentes ofertas na Matola (Tchumene 1 e 2, Matola Rio) e Maputo Cidade (Sommerschield, Polana, Triunfo Novo). Explore o nosso portal ou refira o preço limite!';
      } else {
        responseText = 'Grato pela sua mensagem! O nosso Diretor Geral Edson Jr. ou equipa comercial entrará em contacto direto consigo por WhatsApp muito em breve. Se preferir ligar, dispomos de atendimento comercial em +258 84 956 5078.';
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const quickQuestions = [
    'Quero agendar uma visita 📅',
    'Como anunciar o meu imóvel? 🏠',
    'Qual a documentação para DUAT? 📄',
    'Qual o contacto comercial? 📞'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="floating-helper-chat">
      {/* Floating Action Circle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-[#d4af37] to-[#aa841b] text-slate-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-106 active:scale-95 transition-all duration-300 relative group border border-slate-900"
        >
          <MessageCircle className="w-6 h-6 text-slate-900" />
          <span className="absolute right-15 bg-slate-900 text-[#d4af37] text-[11px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-[#d4af37]/30 shadow-md">
            Conversar Online com o Grupo Edson
          </span>
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Actual Chat Dialog Window */}
      {isOpen && (
        <div className="w-80 sm:w-85 md:w-90 h-[480px] bg-slate-900 border border-[#d4af37]/30 rounded-2xl flex flex-col justify-between shadow-2xl overflow-hidden animate-scale-up text-left">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 border-b border-white/5 py-4 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8.5 h-8.5 rounded-full bg-[#d4af37]/25 flex items-center justify-center border border-[#d4af37]/30">
                <Bot className="w-4.5 h-4.5 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Suporte Grupo Edson Imobiliária</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <span className="text-[9px] text-emerald-400 font-bold font-mono">ASSISTENTE DISPONÍVEL</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages stream area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex gap-2 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
                  {!isUser && (
                    <div className="w-6.5 h-6.5 rounded-full bg-[#d4af37]/15 flex items-center justify-center text-[10px] text-[#d4af37] border border-[#d4af37]/35 flex-shrink-0">
                      V
                    </div>
                  )}
                  <div>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#d4af37] text-slate-900 font-medium rounded-tr-none'
                          : 'bg-slate-800 text-gray-200 rounded-tl-none border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className={`text-[8px] text-gray-500 font-mono mt-1 flex items-center gap-1 ${isUser ? 'justify-end' : ''}`}>
                      {msg.timestamp}
                      {isUser && <CheckCheck className="w-3 text-emerald-500" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 max-w-[80%]">
                <div className="w-6.5 h-6.5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-gray-400 border border-white/5 flex-shrink-0">
                  ...
                </div>
                <div className="bg-slate-800 border border-white/5 px-4 py-2.5 rounded-2xl rounded-tl-none text-xs text-gray-400 italic">
                  O assistente virtual está a escrever...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies suggestion panel */}
          <div className="px-3 py-2 bg-slate-950/60 border-t border-white/5">
            <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Dúvidas Frequentes:</span>
            <div className="flex flex-wrap gap-1">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="text-[10px] bg-white/5 border border-white/5 hover:border-[#d4af37]/30 text-gray-300 hover:text-[#d4af37] px-2 py-1 rounded-md transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input text send panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-slate-950 border-t border-white/5 flex gap-2"
          >
            <input
              type="text"
              placeholder="Digite a sua mensagem aqui..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 bg-gradient-to-r from-[#d4af37] to-[#aa841b] hover:brightness-110 text-slate-900 rounded-xl transition cursor-pointer flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4 text-slate-900" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
