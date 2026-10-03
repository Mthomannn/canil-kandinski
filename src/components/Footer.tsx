import React from 'react';
import { KennelConfig } from '../types';
import { Shield, Heart, ArrowUp, Lock, Download } from 'lucide-react';

interface Props {
  config: KennelConfig;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<Props> = ({ config, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1917] text-[#A8A29E] pt-14 pb-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Registration */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xl font-serif-display font-bold text-white tracking-tight">
              {config.kennelName}
            </h3>
            <p className="text-xs text-[#78716C] max-w-sm leading-relaxed">
              Criatório ético e familiar em Porto Alegre/RS desde {config.foundationYear || '2010'}. Especializado em Golden Retriever,
              Bulldog Inglês e Chihuahua com pureza de linhagem e controle sanitário
              permanente.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-[#78716C]">
              <li>
                <a href="#vendas" className="hover:text-white transition-colors">
                  Filhotes Disponíveis
                </a>
              </li>
              <li>
                <a href="#racas" className="hover:text-white transition-colors">
                  Nossas Raças
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">
                  O Canil & Garantias
                </a>
              </li>
              <li>
                <a href="#redes" className="hover:text-white transition-colors">
                  Comunidade & Redes
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-white transition-colors">
                  Fale com a Daniela
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Atendimento e Localização */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Atendimento & Visitas
            </h4>
            <p className="text-[11px] text-[#78716C] leading-relaxed">
              {config.fullAddress}
            </p>
            <div className="space-y-1 text-[11px] text-[#A8A29E]">
              <p>WhatsApp: {config.phone1}</p>
              <p>Fixo/Secundário: {config.phone2}</p>
              <p>Visitas presenciais com agendamento prévio.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#292524] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78716C]">
          <p>
            Desde {config.foundationYear || '2010'} · © {config.foundationYear || '2010'} - {new Date().getFullYear()} {config.kennelName} · {config.ownerName}. Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/canil-kandinski-github.zip"
              download="canil-kandinski-github.zip"
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-[#292524] hover:bg-[#3E3835] border border-amber-500/40 text-[11px] font-semibold"
              title="Baixar pacote atualizado para o GitHub"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Baixar ZIP (GitHub)</span>
            </a>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 text-[#A8A29E] hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-[#292524] hover:bg-[#3E3835] border border-[#44403C] text-[11px] font-medium"
                title="Área Administrativa do Canil"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Painel do Canil</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
