import React, { useState } from 'react';
import { KennelConfig } from '../types';
import { Sparkles, X } from 'lucide-react';

interface Props {
  config: KennelConfig;
}

export const BannerAnnouncement: React.FC<Props> = ({ config }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!config.bannerNoticeActive || !config.bannerNotice || dismissed) {
    return null;
  }

  return (
    <div className="bg-[#1C1917] text-[#F5F5F4] text-xs py-2 px-4 border-b border-[#292524] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
          <p className="truncate font-medium tracking-tight">
            {config.bannerNotice}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#vendas"
            className="text-[#FBBF24] hover:text-[#FDE68A] transition-colors underline font-medium text-xs whitespace-nowrap"
          >
            Ver Filhotes
          </a>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Fechar aviso"
            className="text-[#A8A29E] hover:text-[#F5F5F4] transition-colors p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
