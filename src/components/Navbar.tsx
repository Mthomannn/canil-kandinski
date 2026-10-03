import React, { useState } from 'react';
import { KennelConfig } from '../types';
import { Menu, X, Shield, PhoneCall, Lock } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  config: KennelConfig;
  onOpenSales: () => void;
  availableCount: number;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<Props> = ({
  config,
  onOpenSales,
  availableCount,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanWhatsappNumber = config.whatsapp.replace(/\D/g, '');

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-[#E7E5E4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#"
          className="text-xl sm:text-2xl font-serif-display font-bold tracking-tight text-[#1C1917] hover:text-[#78350F] transition-colors whitespace-nowrap"
        >
          {config.kennelName}
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#44403C]">
          <a
            href="#vendas"
            className="hover:text-[#1C1917] transition-colors relative py-1"
          >
            Filhotes Disponíveis
            {availableCount > 0 && (
              <span className="ml-1.5 text-xs text-[#B45309] font-mono tabular-nums">
                ({availableCount})
              </span>
            )}
          </a>
          <a
            href="#racas"
            className="hover:text-[#1C1917] transition-colors py-1"
          >
            Nossas Raças
          </a>
          <a
            href="#sobre"
            className="hover:text-[#1C1917] transition-colors py-1"
          >
            O Canil & Garantias
          </a>
          <a
            href="#redes"
            className="hover:text-[#1C1917] transition-colors py-1"
          >
            Comunidade & Redes
          </a>
          <a
            href="#contato"
            className="hover:text-[#1C1917] transition-colors py-1"
          >
            Contato
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <PWAInstallButton variant="navbar" />
          <a
            href={`https://wa.me/${cleanWhatsappNumber}?text=Olá,%20Daniela!%20Visitei%20o%20site%20do%20Canil%20Kandinski%20e%20gostaria%20de%20conversar.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-xs font-medium text-[#065F46] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
          <button
            onClick={onOpenSales}
            className="px-4 py-2 text-xs font-semibold tracking-wide text-white bg-[#1C1917] rounded-lg hover:bg-[#292524] active:scale-[0.98] transition-all whitespace-nowrap shadow-xs cursor-pointer"
          >
            Reservar Online
          </button>
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenSales}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1C1917] rounded-md whitespace-nowrap"
          >
            Filhotes
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#44403C] hover:text-[#1C1917] hover:bg-[#F5F5F4] rounded-md transition-colors"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7E5E4] bg-[#FAFAF9] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-[#292524]">
            <a
              href="#vendas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-[#F5F5F4] transition-colors flex items-center justify-between"
            >
              <span>Filhotes Disponíveis</span>
              <span className="text-xs text-[#B45309] font-mono tabular-nums">
                {availableCount} disponíveis
              </span>
            </a>
            <a
              href="#racas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-[#F5F5F4] transition-colors"
            >
              Nossas Raças (Golden, Bulldog, Chihuahua)
            </a>
            <a
              href="#sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-[#F5F5F4] transition-colors"
            >
              O Canil & Garantia Genética
            </a>
            <a
              href="#redes"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-[#F5F5F4] transition-colors"
            >
              Comunidade & Instagram
            </a>
            <a
              href="#contato"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-md hover:bg-[#F5F5F4] transition-colors"
            >
              Contato & Localização (Porto Alegre)
            </a>
          </nav>

          <div className="pt-3 border-t border-[#E7E5E4] flex flex-col gap-2.5">
            <PWAInstallButton variant="banner" />

            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=Olá,%20Daniela!%20Visitei%20o%20site%20do%20Canil%20Kandinski%20e%20gostaria%20de%20saber%20sobre%20os%20filhotes.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 text-xs font-semibold text-center text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Chamar no WhatsApp ({config.phone1})
            </a>

            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2 text-[11px] text-[#78716C] hover:text-[#1C1917] transition-colors flex items-center justify-center gap-1.5 cursor-pointer pt-2"
              >
                <Lock className="w-3 h-3 text-amber-500" />
                <span>Área da Criadora (Painel)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
