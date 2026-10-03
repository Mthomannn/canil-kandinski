import React, { useState } from 'react';
import { KennelConfig } from '../types';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Check } from 'lucide-react';

interface Props {
  config: KennelConfig;
}

export const ContactSection: React.FC<Props> = ({ config }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [breed, setBreed] = useState('Golden Retriever');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cleanWhatsappNumber = config.whatsapp.replace(/\D/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMsg = `Olá, Daniela! Meu nome é ${name} (telefone: ${phone}). Tenho interesse na raça ${breed}. Mensagem: ${message}`;
    const url = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(url, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contato" className="py-16 bg-[#FAFAF9] border-b border-[#E7E5E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#854D0E] tracking-wider uppercase mb-1">
                <span>Contato Direto com a Criadora</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1C1917]">
                Fale com Daniela no Canil Kandinski
              </h2>
              <p className="text-sm text-[#78716C] mt-2 leading-relaxed">
                Tire suas dúvidas sobre planejamento de ninhadas, reserve filhotes, agende visitas presenciais ou simule cotação de frete aéreo para seu estado.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <a
                href={`https://wa.me/${cleanWhatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-white border border-[#E7E5E4] hover:border-[#D6D3D1] transition-all flex items-center gap-4 block group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#78716C] uppercase tracking-wider block">
                    WhatsApp Principal (Daniela)
                  </span>
                  <span className="text-sm font-semibold font-mono text-[#1C1917] group-hover:text-[#059669] transition-colors">
                    {config.phone1}
                  </span>
                </div>
              </a>

              <div className="p-4 rounded-xl bg-white border border-[#E7E5E4] flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F4] text-[#57534E] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#78716C] uppercase tracking-wider block">
                    Telefone Secundário / Fixo
                  </span>
                  <span className="text-sm font-semibold font-mono text-[#1C1917]">
                    {config.phone2} · (51) 3336-4536
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E7E5E4] flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F4] text-[#57534E] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#78716C] uppercase tracking-wider block">
                    E-mail Oficial
                  </span>
                  <a
                    href={`mailto:${config.email}`}
                    className="text-sm font-semibold font-mono text-[#1C1917] hover:underline"
                  >
                    {config.email}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E7E5E4] flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F4] text-[#57534E] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#78716C] uppercase tracking-wider block">
                    Localização & Visitas
                  </span>
                  <span className="text-xs text-[#1C1917] font-medium block">
                    {config.fullAddress}
                  </span>
                  <span className="text-[11px] text-[#78716C]">
                    Visitas presenciais com agendamento prévio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Fast Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E7E5E4] p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-serif-display font-bold text-[#1C1917] mb-1">
              Envie sua Mensagem Rápida
            </h3>
            <p className="text-xs text-[#78716C] mb-6">
              Preencha abaixo para abrir uma conversa direta no WhatsApp da criadora com todas as suas informações prontas.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mariana Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1">
                    Seu WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(51) 98888-7777"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1C1917] mb-1">
                  Raça de Preferência
                </label>
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917] bg-white cursor-pointer"
                >
                  <option value="Golden Retriever">Golden Retriever</option>
                  <option value="Bulldog Inglês">Bulldog Inglês</option>
                  <option value="Chihuahua">Chihuahua</option>
                  <option value="Dúvida Geral / Próximas Ninhadas">
                    Dúvida Geral / Próximas Ninhadas
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1C1917] mb-1">
                  Mensagem ou Dúvidas
                </label>
                <textarea
                  rows={4}
                  placeholder="Gostaria de saber sobre previsão de entrega, envio para minha cidade, valores..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D6D3D1] rounded-lg focus:outline-none focus:border-[#1C1917]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#292524] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
              >
                {submitted ? (
                  <>
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>Mensagem Encaminhada!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar para WhatsApp da Daniela</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
